// app/api/admin/create-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // adjust path
import Link from "@/models/linkModel"; // adjust path
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { link: l, domain } = body;

    const link = l.replace(/^\/+/, "");

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Input link..!" },
        { status: 400 }
      );
    }

    const exists = await Link.findOne({ link, domain });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Link already exists..!" },
        { status: 409 }
      );
    }

    await Link.create({ link, domain });

    const links = await Link.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: "Link saved..!", data: links },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
};
