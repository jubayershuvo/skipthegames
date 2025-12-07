import { NextRequest, NextResponse } from "next/server";
import Client from "@/models/clientDataModel";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 400 }
      );
    }

    // Convert file -> buffer
    const buffer = Buffer.from(await file.arrayBuffer());


    const img64 = buffer.toString("base64");
    const base64Data = `data:image/jpeg;base64,${img64}`;
    

    // Upload directly to Cloudinary using your lib
    // const photoImg = await uploadOnCloudinary(buffer, "Images", "step1");
    // if (!photoImg || "error" in photoImg) {
    //   return NextResponse.json(
    //     { success: false, message: "Photo saving failed" },
    //     { status: 400 }
    //   );
    // }

    // Update client step1
    const client = await Client.findOne();
    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    const updatedClient = await Client.findByIdAndUpdate(
      client._id,
      { $set: { step1: base64Data } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Photo updated",
      data: updatedClient,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
