import { Schema, models, model } from "mongoose";

const dataSchema = new Schema(
  {
    copiedEmails: {
      type: Number,
      default: 0,
      trim: true,
    },
    mobileClicks: {
      type: Number,
      default: 0,
      trim: true,
    },
    desktopClicks: {
      type: Number,
      default: 0,
      trim: true,
    },
    notifications: {
      type: Number,
      default: 0,
      trim: true,
    },
    alert: {
      type: Boolean,
      default: false,
      trim: true,
    },
    domains: {
      type: Array,
      default: ["http://localhost:3000"],
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in Next.js hot reload
const AdminData = models.AdminData || model("AdminData", dataSchema);

export default AdminData;
