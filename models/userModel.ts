import { Schema, Document, Model, models, model } from "mongoose";

// 1️⃣ Define TypeScript interface for User
export interface IUser extends Document {
  email: string;
  deviceType: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Define Schema
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    deviceType: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// 3️⃣ Prevent OverwriteModelError in Next.js hot reload
const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
