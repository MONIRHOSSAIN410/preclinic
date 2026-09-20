import Department from "../models/Department.js";
import Specialization from "../models/Specialization.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

export const getDepartments = getAll(Department, ["name"]);
export const getDepartment = getOne(Department);
export const createDepartment = createOne(Department);
export const updateDepartment = updateOne(Department);
export const deleteDepartment = deleteOne(Department);

export const getSpecializations = getAll(Specialization, ["name"]);
export const getSpecialization = getOne(Specialization);
export const createSpecialization = createOne(Specialization);
export const updateSpecialization = updateOne(Specialization);
export const deleteSpecialization = deleteOne(Specialization);
