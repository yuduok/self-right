import { NextResponse } from "next/server";

export async function POST (request) {
  const { id  } = await request.json();
  console.log(id);

  try{
    const response = await fetch(`http://47.98.178.174:8080/getkey?id=${id}`, {
        method: "GET",
        headers: {
              "Content-Type": "application/json",
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