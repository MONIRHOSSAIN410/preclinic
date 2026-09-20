import express from "express";
import { registerAdmin, loginAdmin, getMe, updateMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
