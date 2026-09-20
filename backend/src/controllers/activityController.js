import Activity from "../models/Activity.js";
import { getAll, getOne, createOne, deleteOne } from "./factory.js";

export const getActivities = getAll(Activity);
export const getActivity = getOne(Activity);
export const createActivity = createOne(Activity);
export const deleteActivity = deleteOne(Activity);
