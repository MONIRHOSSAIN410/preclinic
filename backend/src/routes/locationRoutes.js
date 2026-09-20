import express from "express";
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getLocations).post(protect, createLocation);
router
  .route("/:id")
  .get(protect, getLocation)
  .put(protect, updateLocation)
  .delete(protect, deleteLocation);

export default router;
