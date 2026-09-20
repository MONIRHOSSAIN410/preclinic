import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

import Admin from "../models/Admin.js";
import Department from "../models/Department.js";
import Specialization from "../models/Specialization.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import Invoice from "../models/Invoice.js";
import Activity from "../models/Activity.js";
import Location from "../models/Location.js";

dotenv.config();

const DEPARTMENTS = [
  "General Medicine",
  "Cardiology",
  "Dentistry",
  "Ophthalmology",
  "Radiology",
  "Physiotherapy",
  "Pathology",
  "ENT",
  "Nutrition",
  "Oncology",
  "Gynecology",
  "Psychiatry",
  "Urology",
  "Pulmonology",
  "Neurosurgery",
  "Dermatology",
];

const SPECIALIZATIONS = [
  "Cardiologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "Oncologist",
  "Pulmonologist",
  "Urologist",
  "Practitioner",
  "Surgeon",
  "Neurosurgeon",
  "Dermatologist",
  "Dentist",
  "Ophthalmologist",
];

const SERVICES_LIST = [
  { name: "General Consultation", department: "General Medicine", price: 200 },
  { name: "Dental Cleaning", department: "Dentistry", price: 180 },
  { name: "Eye Checkup", department: "Ophthalmology", price: 150 },
  { name: "X-Ray", department: "Radiology", price: 80, status: "Inactive" },
  { name: "Physiotherapy Session", department: "Physiotherapy", price: 130 },
  { name: "Cardiac Screening", department: "Cardiology", price: 300 },
  { name: "Skin Allergy Test", department: "Dermatology", price: 220 },
  { name: "Blood Test", department: "Pathology", price: 150 },
  { name: "ENT Consultation", department: "ENT", price: 230, status: "Inactive" },
  { name: "Nutrition Counseling", department: "Nutrition", price: 250 },
  { name: "Full Body Checkup", department: "General Medicine", price: 400 },
  { name: "MRI Scan", department: "Radiology", price: 650 },
  { name: "Root Canal Treatment", department: "Dentistry", price: 500 },
  { name: "Vaccination", department: "General Medicine", price: 90 },
  { name: "Ultrasound", department: "Radiology", price: 220 },
];

const ACTIVITY_TEMPLATES = [
  { title: "Completed the Patient visit", type: "visit", description: "The patient successfully completed a scheduled visit. All clinical notes, diagnostics, and visit outcomes have been recorded and stored in the medical record." },
  { title: "Uploaded new photos for World Safety Event", type: "upload", description: "New event photos were uploaded to the shared clinic gallery." },
  { title: "Doctors Meeting", type: "meeting", description: "Monthly clinical review and coordination meeting held with all department heads." },
  { title: "Completed the Operation Within Deadline", type: "operation", description: "The scheduled operation was completed successfully within the planned timeframe." },
  { title: "Posted a new blog about Safety Measures", type: "blog", description: "Shared essential health and safety protocols for patients and staff." },
  { title: "Updated Doctor Schedule", type: "system", description: "Doctor availability and schedule were updated for the upcoming week." },
  { title: "New Patient Registered", type: "system", description: "A new patient profile was created and added to the clinic database." },
  { title: "Invoice Generated", type: "system", description: "A new invoice was generated and sent to the patient." },
];

const AVATAR_SEED = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomStatus = (weights) => {
  const r = Math.random();
  let sum = 0;
  for (const [status, weight] of Object.entries(weights)) {
    sum += weight;
    if (r <= sum) return status;
  }
  return Object.keys(weights)[0];
};

const shouldDestroy = process.argv.includes("--destroy");

const run = async () => {
  await connectDB();

  if (shouldDestroy) {
    await Promise.all([
      Admin.deleteMany(),
      Department.deleteMany(),
      Specialization.deleteMany(),
      Doctor.deleteMany(),
      Patient.deleteMany(),
      Appointment.deleteMany(),
      Service.deleteMany(),
      Invoice.deleteMany(),
      Activity.deleteMany(),
      Location.deleteMany(),
    ]);
    console.log("🗑️  All collections cleared.");
    process.exit(0);
  }

  console.log("🌱 Seeding database...");

  // Clear existing sample data (keep it idempotent)
  await Promise.all([
    Department.deleteMany(),
    Specialization.deleteMany(),
    Doctor.deleteMany(),
    Patient.deleteMany(),
    Appointment.deleteMany(),
    Service.deleteMany(),
    Invoice.deleteMany(),
    Activity.deleteMany(),
    Location.deleteMany(),
  ]);

  // Admin
  const adminExists = await Admin.findOne({ email: "admin@preclinic.com" });
  if (!adminExists) {
    await Admin.create({
      name: "Rakib Admin",
      email: "admin@preclinic.com",
      password: "admin123",
      role: "superadmin",
      clinicName: "Trustcare Clinic",
      avatar: AVATAR_SEED("admin-rakib"),
    });
    console.log("👤 Default admin created -> admin@preclinic.com / admin123");
  }

  // Departments
  const departments = await Department.insertMany(
    DEPARTMENTS.map((name) => ({ name, description: `${name} department` }))
  );

  // Specializations
  const specializations = await Specialization.insertMany(
    SPECIALIZATIONS.map((name) => ({ name, doctorCount: 0 }))
  );

  // Doctors
  const doctorDocs = [];
  for (let i = 0; i < 42; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `Dr. ${firstName} ${lastName}`;
    const specialization = randomFrom(SPECIALIZATIONS);
    const department = randomFrom(DEPARTMENTS);
    doctorDocs.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number("+1 ##########"),
      avatar: AVATAR_SEED(name + i),
      specialization,
      department,
      designation: randomFrom(["Consultant", "Senior Consultant", "Head of Department", "Practitioner"]),
      gender: randomFrom(["Male", "Female"]),
      experience: faker.number.int({ min: 1, max: 25 }),
      fees: faker.number.int({ min: 150, max: 600 }),
      bookings: faker.number.int({ min: 10, max: 320 }),
      rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
      availableFrom: "09:00",
      availableTo: "17:00",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      bio: faker.lorem.sentences(2),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, USA`,
      status: randomStatus({ Active: 0.9, Inactive: 0.1 }),
    });
  }
  const doctors = await Doctor.insertMany(doctorDocs);

  // Patients
  const patientDocs = [];
  for (let i = 0; i < 90; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    patientDocs.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number("+1 ##########"),
      avatar: AVATAR_SEED(name + i),
      dob: faker.date.birthdate({ min: 1, max: 85, mode: "age" }),
      gender: randomFrom(["Male", "Female"]),
      bloodGroup: randomFrom(["A+ve", "A-ve", "B+ve", "B-ve", "O+ve", "O-ve", "AB+ve", "AB-ve"]),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, USA`,
      vitals: {
        bloodPressure: `${faker.number.int({ min: 100, max: 140 })}/${faker.number.int({ min: 60, max: 90 })} mmHg`,
        heartRate: faker.number.int({ min: 60, max: 100 }),
        spo2: faker.number.int({ min: 95, max: 100 }),
        temperature: faker.number.float({ min: 97, max: 101, precision: 0.1 }),
        respiratoryRate: faker.number.int({ min: 14, max: 24 }),
        weight: faker.number.int({ min: 45, max: 100 }),
      },
      lastVisited: faker.date.recent({ days: 60 }),
      status: randomStatus({ Active: 0.92, Inactive: 0.08 }),
    });
  }
  const patients = await Patient.insertMany(patientDocs);

  // Appointments (spread across the current year)
  const currentYear = new Date().getFullYear();
  const appointmentDocs = [];
  const statuses = ["Checked Out", "Checked In", "Confirmed", "Cancelled", "Scheduled", "Rescheduled"];
  for (let i = 0; i < 260; i++) {
    const doctor = randomFrom(doctors);
    const patient = randomFrom(patients);
    const month = faker.number.int({ min: 0, max: 11 });
    const day = faker.number.int({ min: 1, max: 28 });
    const date = new Date(currentYear, month, day);
    appointmentDocs.push({
      doctor: doctor._id,
      patient: patient._id,
      date,
      time: `${faker.number.int({ min: 8, max: 17 })}:${randomFrom(["00", "15", "30", "45"])}`,
      mode: randomFrom(["In-person", "Online"]),
      reason: randomFrom(["General Visit", "Follow-up", "Consultation", "Routine Checkup", "Emergency"]),
      status: date > new Date() ? randomFrom(["Scheduled", "Confirmed", "Rescheduled"]) : randomFrom(statuses),
      fees: doctor.fees,
    });
  }
  await Appointment.insertMany(appointmentDocs);

  // Locations (clinic branches)
  const locations = await Location.insertMany([
    { name: "Trustcare Clinic - Downtown", address: "120 Green Square, New York, USA" },
    { name: "Trustcare Clinic - Lakeview", address: "45 Lakeview Drive, Chicago, USA" },
    { name: "Trustcare Clinic - Riverside", address: "8 River Walk, Houston, USA" },
    { name: "Trustcare Clinic - Maple Branch", address: "12 Maple Street, San Francisco, USA" },
  ]);

  // Services
  await Service.insertMany(
    SERVICES_LIST.map((s) => ({ ...s, status: s.status || "Active", description: `${s.name} service` }))
  );

  // Invoices
  const invoiceDocs = [];
  for (let i = 0; i < 35; i++) {
    const patient = randomFrom(patients);
    const doctor = randomFrom(doctors);
    const issuedOn = faker.date.recent({ days: 90 });
    const dueDate = new Date(issuedOn);
    dueDate.setDate(dueDate.getDate() + 14);
    const items = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => {
      const svc = randomFrom(SERVICES_LIST);
      return {
        name: svc.name,
        description: `Routine ${svc.name.toLowerCase()}`,
        unitCost: svc.price,
        quantity: faker.number.int({ min: 1, max: 2 }),
      };
    });
    invoiceDocs.push({
      patient: patient._id,
      doctor: doctor._id,
      issuedOn,
      dueDate,
      items,
      taxPercent: 9,
      discountPercent: randomFrom([0, 0, 10, 25]),
      bankName: "ABC Bank",
      accountNumber: faker.finance.accountNumber(9),
      ifscCode: "ABC0001345",
      recurring: randomFrom(["None", "None", "Monthly"]),
      status: randomFrom(["Paid", "Due", "Overdue"]),
    });
  }
  await Invoice.insertMany(invoiceDocs);

  // Activities
  const activityDocs = ACTIVITY_TEMPLATES.map((tpl, idx) => ({
    ...tpl,
    actor: faker.person.fullName(),
    actorAvatar: AVATAR_SEED("activity" + idx),
    createdAt: faker.date.recent({ days: 20 }),
  }));
  await Activity.insertMany(activityDocs);

  console.log("✅ Seed complete:");
  console.log(`   Departments: ${departments.length}`);
  console.log(`   Specializations: ${specializations.length}`);
  console.log(`   Doctors: ${doctors.length}`);
  console.log(`   Patients: ${patients.length}`);
  console.log(`   Appointments: ${appointmentDocs.length}`);
  console.log(`   Services: ${SERVICES_LIST.length}`);
  console.log(`   Invoices: ${invoiceDocs.length}`);
  console.log(`   Activities: ${activityDocs.length}`);
  console.log(`   Locations: ${locations.length}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
