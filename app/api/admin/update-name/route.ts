// app/update-name/route.ts
import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/adminModel";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // ensure DB is connected

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    // Get admin ID from middleware header
    const admindata = await Admin.findOne();
    const adminId = admindata?._id;

    // Update admin
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { name },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Name updated successfully",
      data: admin,
    });
  } catch (error: unknown) {
    console.error(error);
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
