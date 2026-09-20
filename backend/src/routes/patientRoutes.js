import express from "express";
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientFull,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPatients).post(protect, createPatient);
router.get("/:id/full", protect, getPatientFull);
router
  .route("/:id")
  .get(protect, getPatient)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

export default router;
