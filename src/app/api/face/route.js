import { NextResponse } from "next/server";

export async function POST(request) {
  const { image } = await request.json();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/togovernment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": request.cookies.get('token')?.value
      },
      body: JSON.stringify({
        image
      }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "人脸上传失败" },
      { status: 500 }
    );
  }
}