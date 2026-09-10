// app/change/telegram_chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import Client from "@/models/clientDataModel"; // import your Client mongoose model
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { telegram_chat } = body;

    if (!telegram_chat || telegram_chat.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Telegram chat ID is required" },
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

    // Update telegram chat ID
    const updatedClient = await Client.findByIdAndUpdate(
      client._id,
      { $set: { telegramChatId: telegram_chat } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Telegram chat ID updated successfully",
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
