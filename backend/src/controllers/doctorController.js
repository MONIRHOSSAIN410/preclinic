import Doctor from "../models/Doctor.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

const searchFields = ["name", "email", "specialization", "department"];

export const getDoctors = getAll(Doctor, searchFields);
export const getDoctor = getOne(Doctor);
export const createDoctor = createOne(Doctor);
export const updateDoctor = updateOne(Doctor);
export const deleteDoctor = deleteOne(Doctor);
