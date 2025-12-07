import Admin from "@/models/adminModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

interface AdminLoginBody {
  admin: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Parse request body
    const body: AdminLoginBody = await req.json();
    const { admin, password } = body;

    if (!admin || !password) {
      return NextResponse.json(
        { success: false, message: "Enter username and password!" },
        { status: 400 }
      );
    }

    // 3️⃣ Create default admin if none exists
    const totalUsers = await Admin.countDocuments({});
    if (totalUsers === 0) {
      await Admin.create({ name: "Admin", username: admin, password });
    }

    // 4️⃣ Find the first admin
    const user = await Admin.findOne({ username: admin }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Admin not found!" },
        { status: 404 }
      );
    }

    // 5️⃣ Validate password using model method
    
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Password does not match!" },
        { status: 401 }
      );
    }

    // 6️⃣ Generate JWT token
    const adminAccessToken = user.generateAccessToken();

    // 7️⃣ Return user data without password
    const loggedUser = await Admin.findById(user._id).select("-password");

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      data: loggedUser,
    });

    // 8️⃣ Set HTTP-only cookie
    response.cookies.set({
      name: "adminAccessToken",
      value: adminAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
