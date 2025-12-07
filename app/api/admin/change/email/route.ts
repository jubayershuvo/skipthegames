// app/change/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import Client from "@/models/clientDataModel"; // import your Client mongoose model
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    if (!email || email.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the first client
    const client = await Client.findOne();
    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    // Update email
    const updatedClient = await Client.findByIdAndUpdate(
      client._id,
      { $set: { email } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Email updated successfully",
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
