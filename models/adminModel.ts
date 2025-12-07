import mongoose, { Schema, Document, Model } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";

// 1️⃣ TypeScript interface for Admin document
export interface IAdmin extends Document {
  name: string;
  username: string;
  password: string;
  generateAccessToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2️⃣ Admin schema
const adminSchema: Schema<IAdmin> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
  },
  { timestamps: true }
);



// 5️⃣ Generate JWT token method
adminSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!secret)
    throw new Error(
      "JWT_ACCESS_SECRET_KEY is not defined in environment variables"
    );

  const options: SignOptions = { expiresIn: "1d" };

  return jwt.sign(
    { _id: this._id, name: this.name, username: this.username },
    secret,
    options
  );
};

// 6️⃣ Prevent model overwrite in Next.js dev mode
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
