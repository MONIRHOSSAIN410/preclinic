import express from "express";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getServices).post(protect, createService);
router
  .route("/:id")
  .get(protect, getService)
  .put(protect, updateService)
  .delete(protect, deleteService);

export default router;
