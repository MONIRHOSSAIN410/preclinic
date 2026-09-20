import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, default: "Consultant" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    experience: { type: Number, default: 1 },
    fees: { type: Number, required: true, default: 200 },
    bookings: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    availableFrom: { type: String, default: "09:00" },
    availableTo: { type: String, default: "17:00" },
    availableDays: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    bio: { type: String, default: "" },
    address: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", email: "text", specialization: "text" });

export default mongoose.model("Doctor", doctorSchema);
