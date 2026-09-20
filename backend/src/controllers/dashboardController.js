import asyncHandler from "express-async-handler";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Invoice from "../models/Invoice.js";
import Activity from "../models/Activity.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// @desc    Aggregate stats for the admin dashboard overview
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [doctorCount, patientCount, appointmentCount, invoices] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments(),
    Invoice.find(),
  ]);

  const revenue = invoices.reduce((sum, inv) => {
    const subtotal = inv.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
    const tax = (subtotal * inv.taxPercent) / 100;
    const discount = (subtotal * inv.discountPercent) / 100;
    return sum + (subtotal + tax - discount);
  }, 0);

  const currentYear = new Date().getFullYear();
  const appointments = await Appointment.find({
    date: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) },
  });

  const monthly = MONTHS.map((m) => ({ month: m, completed: 0, cancelled: 0, rescheduled: 0 }));
  appointments.forEach((appt) => {
    const idx = new Date(appt.date).getMonth();
    if (appt.status === "Checked Out") monthly[idx].completed += 1;
    else if (appt.status === "Cancelled") monthly[idx].cancelled += 1;
    else if (appt.status === "Rescheduled") monthly[idx].rescheduled += 1;
    else monthly[idx].completed += 1;
  });

  const popularDoctors = await Doctor.find().sort("-bookings").limit(5).select("name specialization bookings avatar");

  const recentAppointments = await Appointment.find()
    .populate("patient", "name avatar")
    .populate("doctor", "name specialization avatar")
    .sort("-date")
    .limit(6);

  const recentActivities = await Activity.find().sort("-createdAt").limit(8);

  res.json({
    success: true,
    data: {
      counters: {
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        revenue: Math.round(revenue * 100) / 100,
      },
      monthlyAppointments: monthly,
      popularDoctors,
      recentAppointments,
      recentActivities,
    },
  });
});

// @desc    Reports page aggregate data
// @route   GET /api/dashboard/reports
export const getReports = asyncHandler(async (req, res) => {
  const statusAgg = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const invoiceStatusAgg = await Invoice.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const departmentAgg = await Doctor.aggregate([
    { $group: { _id: "$department", doctors: { $sum: 1 }, bookings: { $sum: "$bookings" } } },
  ]);

  res.json({
    success: true,
    data: {
      appointmentsByStatus: statusAgg.map((s) => ({ status: s._id, count: s.count })),
      invoicesByStatus: invoiceStatusAgg.map((s) => ({ status: s._id, count: s.count })),
      departmentBreakdown: departmentAgg.map((d) => ({
        department: d._id,
        doctors: d.doctors,
        bookings: d.bookings,
      })),
    },
  });
});
