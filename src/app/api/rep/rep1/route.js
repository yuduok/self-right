import { NextResponse } from "next/server";

export async function POST(request) {
  const { id } = await request.json();
  try{
    const response = await fetch(`http://47.98.178.174:8080/req/req1/state?id=${id}`, {
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