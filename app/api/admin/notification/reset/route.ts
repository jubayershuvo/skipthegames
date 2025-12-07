// app/api/admin/notification/reset/route.ts
import { NextRequest, NextResponse } from "next/server";

import Data from "@/models/dataModel";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const data = await Data.findOne();
    if (!data) {
      return NextResponse.json(
        { success: false, message: "Data not found" },
        { status: 404 }
      );
    }

    await Data.findByIdAndUpdate(data._id, { $set: { notifications: 0 } });

    return NextResponse.json(
      { success: true, message: "Notifications reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("resetNotification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
