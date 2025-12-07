import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB_URL || "";
const DB_NAME = process.env.DB_NAME || "";

if (!MONGO_URI || !DB_NAME) {
  throw new Error("Please define MONGO_DB_URL and DB_NAME environment variables");
}

export async function connectDB() {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
