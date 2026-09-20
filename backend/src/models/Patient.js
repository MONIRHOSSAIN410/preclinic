import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    bloodGroup: { type: String, default: "O+ve" },
    address: { type: String, default: "" },
    vitals: {
      bloodPressure: { type: String, default: "120/80 mmHg" },
      heartRate: { type: Number, default: 72 },
      spo2: { type: Number, default: 98 },
      temperature: { type: Number, default: 98.6 },
      respiratoryRate: { type: Number, default: 18 },
      weight: { type: Number, default: 70 },
    },
    lastVisited: { type: Date },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

patientSchema.pre("validate", function (next) {
  if (!this.patientId) {
    this.patientId = "PT" + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

patientSchema.index({ name: "text", email: "text", phone: "text" });

export default mongoose.model("Patient", patientSchema);
