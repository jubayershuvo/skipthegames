// app/api/admin/delete-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // adjust path
import AdminData from "@/models/dataModel";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    let { domain } = body;

    if (!domain.startsWith("http://") && !domain.startsWith("https://")) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain must start with http:// or https://",
        },
        { status: 400 }
      );
    }

    domain = domain.replace(/\/$/, "");

    let data = await AdminData.findOne().exec();

    if (!data) {
      data = await AdminData.create({});
    }

    await AdminData.updateOne(
      { _id: data._id },
      { $addToSet: { domains: domain } }
    );

    const allData = await AdminData.findOne().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Domain added successfully!",
        data: allData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
};
