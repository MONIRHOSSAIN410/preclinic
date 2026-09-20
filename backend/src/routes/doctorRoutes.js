import express from "express";
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDoctors).post(protect, createDoctor);
router
  .route("/:id")
  .get(protect, getDoctor)
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

export default router;
