import { NextResponse } from "next/server";

export async function POST(request) {
  const { image } = await request.json();
  try {
    const response = await fetch("http://127.0.0.1:4523/m1/5176569-4841671-default/api/face", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image
      }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "人脸识别失败" },
      { status: 500 }
    );
  }
}