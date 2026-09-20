import Invoice from "../models/Invoice.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

export const getInvoices = getAll(Invoice, [], "patient doctor");
export const getInvoice = getOne(Invoice, "patient doctor");
export const createInvoice = createOne(Invoice);
export const updateInvoice = updateOne(Invoice);
export const deleteInvoice = deleteOne(Invoice);
