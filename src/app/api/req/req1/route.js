import { NextResponse } from "next/server";

export async function POST(request) {
  const { ciphertext,token } = await request.json();
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/req/req1?ciphertext=${ciphertext}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        }
    })
    const data = await response.json();
    console.log(data)
    return NextResponse.json(data);
  }catch(error){
    return NextResponse.json(
      { message: "发送请求失败" },
      { status: 500 });
  }
}