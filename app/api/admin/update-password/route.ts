// app/update-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/adminModel";
import { connectDB } from "@/lib/db";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { password, oldpassword } = body;

    if (!password || !oldpassword) {
      return NextResponse.json(
        { success: false, message: "Both old and new passwords are required." },
        { status: 400 }
      );
    }  

    const admindata = await Admin.findOne();
    const adminId = admindata?._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found." },
        { status: 404 }
      );
    }
    
    if (admin.password !== oldpassword) {
      return NextResponse.json(
        { success: false, message: "Old Password does not match!" },
        { status: 401 }
      );
    }

    await Admin.findByIdAndUpdate(adminId, { password }, { new: true });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
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
