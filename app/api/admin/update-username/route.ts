// app/update-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/adminModel"; // your Mongoose model
import { connectDB } from "@/lib/db";

type AdminRequest = NextRequest & { admin?: { _id: string } };

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // ensure DB is connected

    const body = await req.json();
    const { username } = body;

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Username is required." },
        { status: 400 }
      );
    }

    if (username.includes(" ")) {
      return NextResponse.json(
        { success: false, message: "Username cannot contain spaces." },
        { status: 400 }
      );
    }

    // Assuming you set req.admin via middleware (or decode JWT)
    const admindata = await Admin.findOne();
    const adminId = admindata?._id;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { username },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Username updated successfully",
      data: admin,
    });
  } catch (error: unknown) {
    console.error(error);
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
