import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["visit", "upload", "meeting", "operation", "blog", "system"],
      default: "system",
    },
    actor: { type: String, default: "System" },
    actorAvatar: { type: String, default: "" },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
