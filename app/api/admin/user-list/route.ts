// app/api/admin/user-list/route.ts
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: "Users returned..!", data: users },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
