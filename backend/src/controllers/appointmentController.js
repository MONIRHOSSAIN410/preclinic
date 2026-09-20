import Appointment from "../models/Appointment.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

export const getAppointments = getAll(Appointment, [], "patient doctor");
export const getAppointment = getOne(Appointment, "patient doctor");
export const createAppointment = createOne(Appointment);
export const updateAppointment = updateOne(Appointment);
export const deleteAppointment = deleteOne(Appointment);
