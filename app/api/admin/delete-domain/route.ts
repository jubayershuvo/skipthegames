// app/api/admin/delete-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // adjust path
import AdminData from "@/models/dataModel";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    const { domain } = body;
    const data = await AdminData.findOne();

    await AdminData.updateOne(
      { _id: data._id },
      { $pull: { domains: domain } }
    );
    
    const allData =  await AdminData.findOne().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "All links deleted successfully!",
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
