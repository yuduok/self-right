import { NextResponse } from "next/server";

export async function POST (request) {
  const { token  } = await request.json();
  console.log(token);

  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getkey/sycbytoken`, {
        method: "GET",
        headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
              }
    })
    const data = await response.json();
    return NextResponse.json(data) 
  }catch(error){
    return NextResponse.json(
      { message: "获取密钥失败" },
      { status: 500 });
  }
}