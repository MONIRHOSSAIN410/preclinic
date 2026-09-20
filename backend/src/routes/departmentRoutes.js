import express from "express";
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDepartments).post(protect, createDepartment);
router
  .route("/:id")
  .get(protect, getDepartment)
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment);

export const specializationRouter = express.Router();
specializationRouter.route("/").get(protect, getSpecializations).post(protect, createSpecialization);
specializationRouter
  .route("/:id")
  .get(protect, getSpecialization)
  .put(protect, updateSpecialization)
  .delete(protect, deleteSpecialization);

export default router;
