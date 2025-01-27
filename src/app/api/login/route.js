import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        username, 
        password
      }),
    });

    const data = await response.json();

    if (!data.data) {
      return NextResponse.json({ message: "登录失败：无效的令牌" }, { status: 401 });
    }

    const res = NextResponse.json(data);
    res.cookies.set("token", data.data, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "登录失败", error: error.message },
      { status: 500 }
    );
  }
}