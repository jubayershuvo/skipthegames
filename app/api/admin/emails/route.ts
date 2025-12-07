
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  try {
    let emails;
    try {
      const res = await axios.get(process.env.EMAIL_SERVER_URL + "/api/emails");
      emails = res.data.emails;
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(
      { success: true, message: "Emails returned..!", emails: emails },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
};
