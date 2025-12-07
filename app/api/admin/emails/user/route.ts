// app/api/emails/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }
    let emails;

    try {
      const res = await axios.get(
        process.env.EMAIL_SERVER_URL + "/api/emails/user?email=" + email
      );
      emails = res.data.emails;
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
