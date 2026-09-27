// app/api/admin/user-status/route.ts
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Allowed values for the admin action
const ALLOWED_STATUS = ["", "email-wrong", "password-wrong"];

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { id, status } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User id is required..!" },
        { status: 400 }
      );
    }

    if (typeof status !== "string" || !ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status..!" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id..!" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found..!" },
        { status: 404 }
      );
    }

    // 🛡️ Safety net: a process still running an older schema silently drops the
    // write, which would look like a success while nothing was saved.
    if ((user.status || "") !== status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status was not saved. Please restart the server and try again..!",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User status updated..!", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
