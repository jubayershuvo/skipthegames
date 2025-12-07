// app/api/copy-link/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Data from "@/models/dataModel";

// 📌 Increase copiedEmails count
export async function GET() {
  try {
    await connectDB();

    const data = await Data.findOne();

    if (data) {
      await Data.findByIdAndUpdate(
        data._id,
        { $inc: { copiedEmails: 1 } },
        { new: true }
      );
    } else {
      await Data.create({ copiedEmails: 1 });
    }

    return NextResponse.json(
      { success: true, message: "Copied..!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
