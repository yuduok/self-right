import { NextResponse } from "next/server";

export async function GET (request) {
  const { uid  } = await request.json();

  try{
    const response = await fetch("", {
        method: "GET",
        headers: {
              "Content-Type": "application/json",
                    },
        body: JSON.stringify({
          uid
        }),
    })
    const data = await response.json();
    return NextResponse.json(data) 
  }catch(error){
    return NextResponse.json(
      { message: "密钥失败" },
      { status: 500 });
  }
}