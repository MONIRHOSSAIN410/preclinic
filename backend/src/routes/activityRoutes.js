import express from "express";
import {
  getActivities,
  getActivity,
  createActivity,
  deleteActivity,
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getActivities).post(protect, createActivity);
router.route("/:id").get(protect, getActivity).delete(protect, deleteActivity);

export default router;
