import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: ["In-person", "Online"], default: "In-person" },
    reason: { type: String, default: "General Visit" },
    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Rescheduled"],
      default: "Scheduled",
    },
    fees: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
