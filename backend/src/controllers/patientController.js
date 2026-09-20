import asyncHandler from "express-async-handler";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

const searchFields = ["name", "email", "phone", "patientId"];

export const getPatients = getAll(Patient, searchFields);
export const getPatient = getOne(Patient);
export const createPatient = createOne(Patient);
export const updatePatient = updateOne(Patient);
export const deletePatient = deleteOne(Patient);

// @desc    Get a patient with their appointment history
// @route   GET /api/patients/:id/full
export const getPatientFull = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  const appointments = await Appointment.find({ patient: patient._id })
    .populate("doctor", "name specialization avatar")
    .sort("-date");

  res.json({ success: true, data: { patient, appointments } });
});
