import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password, type } = await request.json();

  try{
    const response = await fetch("", {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
                    },
        body: JSON.stringify({
          username,
          password,
          type
        }),
    })
    const data = await response.json();
    return NextResponse.json(data)
  }catch(error){
    return NextResponse.json(
      { message: "注册失败" },
      { status: 500 });
  }
}
