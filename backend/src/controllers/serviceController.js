import Service from "../models/Service.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

const searchFields = ["name", "department"];

export const getServices = getAll(Service, searchFields);
export const getService = getOne(Service);
export const createService = createOne(Service);
export const updateService = updateOne(Service);
export const deleteService = deleteOne(Service);
