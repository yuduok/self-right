import { NextResponse } from "next/server";

// 查询智能化身账号
export async function POST(request) {
  const { token } = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/institution/getAccount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  }
  catch (error) {
    return NextResponse.json({ message: "查询失败" }, { status: 500 });
  }
}