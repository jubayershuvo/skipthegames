import { connectDB } from "@/lib/db";
import Client from "@/models/clientDataModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    let data = await Client.findOne();


    if (!data) {
      data = await Client.create({});
      return NextResponse.json({
        success: true,
        message: "data created..",
        data,
      });
    }

    return NextResponse.json({
      success: true,
      message: "data gotted..",
      data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
