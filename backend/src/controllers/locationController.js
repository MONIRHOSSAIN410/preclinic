import Location from "../models/Location.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "./factory.js";

export const getLocations = getAll(Location, ["name", "address"]);
export const getLocation = getOne(Location);
export const createLocation = createOne(Location);
export const updateLocation = updateOne(Location);
export const deleteLocation = deleteOne(Location);
