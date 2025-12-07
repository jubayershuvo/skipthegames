import { connectDB } from "@/lib/db";
import AdminData from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const data = await AdminData.findOne();
    if (!data) {
      return NextResponse.json(
        { success: false, message: "Data not found" },
        { status: 404 }
      );
    }

    await AdminData.findByIdAndUpdate(data._id, { $set: { alert: false } });

    return NextResponse.json({
      success: true,
      message: "Alert reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
