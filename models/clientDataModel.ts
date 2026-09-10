import { Schema, models, model } from "mongoose";

const clientDataSchema = new Schema(
  {
    email: {
      type: String,
      default: "example@ex.com",
      trim: true,
    },
    step1: {
      type: String,
      default: "",
      trim: true,
    },
    step2: {
      type: String,
      default: "",
      trim: true,
    },
    step3: {
      type: String,
      default: "",
      trim: true,
    },
    telegramChatId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError and avoid name conflicts
const ClientData = models.ClientData || model("ClientData", clientDataSchema);

export default ClientData;
