// app/api/admin/links/route.ts
import { NextRequest, NextResponse } from "next/server";

import Link from "@/models/linkModel"; // adjust the path
import { connectDB } from "@/lib/db";

// GET /api/links
export const GET = async (req: NextRequest) => {
  try {
    await connectDB(); // make sure DB is connected


    const links = await Link.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, message: "Links returned..!", data: links },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
};
