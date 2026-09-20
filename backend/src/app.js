import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import departmentRoutes, { specializationRouter } from "./routes/departmentRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// CLIENT_URL can hold several comma-separated origins
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        /^https:\/\/preclinic[a-z0-9-]*\.vercel\.app$/.test(origin) // Vercel production + preview URLs
      ) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
  })
);

// Make sure MongoDB is connected before handling API requests (needed on serverless)
app.use(async (req, res, next) => {
  if (req.path === "/" || req.path === "/api/health") return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ message: "Preclinic Dashboard API is running 🚀" });
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/specializations", specializationRouter);
app.use("/api/locations", locationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
