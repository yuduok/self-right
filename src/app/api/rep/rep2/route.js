import { NextResponse } from "next/server";

export async function POST(request) {
  const { id } = await request.json();
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/req/req2/state?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  }catch(error){
    return NextResponse.json(
      { message: "发送请求失败" },
      { status: 500 });
  }
}