import { connectDB } from "@/lib/db";
import AdminData from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    let data = await AdminData.findOne();

    if (!data) {
      data = await AdminData.create({});
    }

    let count = 0;
    let clicks = 0;

    try {
      const res = await fetch(`${process.env.EMAIL_SERVER_URL}/api/visitors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // avoid caching
      });

      if (res.ok) {
        const json = await res.json();
        count = json?.visitors?.count ?? 0;
        clicks = json?.visitors?.clicks ?? 0;
      }
    } catch (error) {
      console.error("Error fetching visitors:",error);
    }

    const sendData = {
      ...data.toObject(), // safer than _doc
      visitors: count,
      clicks: clicks,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Copied..!",
        data: sendData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error..!",
      },
      { status: 500 }
    );
  }
}
