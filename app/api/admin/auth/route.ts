import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    // Get admin code from environment variable
    const adminCode = process.env.ADMIN_CODE;

    if (!adminCode) {
      console.error("ADMIN_CODE environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify the code
    if (code !== adminCode) {
      return NextResponse.json(
        { error: "Invalid admin code" },
        { status: 401 }
      );
    }

    // Set authentication cookie
    const cookieStore = await cookies();
    const token = process.env.ADMIN_TOKEN || "admin_authenticated";
    
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}


