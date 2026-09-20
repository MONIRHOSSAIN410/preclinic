import express from "express";
import { getDashboardSummary, getReports } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/reports", protect, getReports);

export default router;
