import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password, registerType,validation } = await request.json();
  console.log(username, password, registerType,validation)

  try{
    const body = {
        username:username,
        password:password,
        type: registerType
    };

    if (validation) {
        body.checkCode = validation;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    const data = await response.json();
    return NextResponse.json(data)
  }catch(error){
    return NextResponse.json(
      { message: "注册失败" },
      { status: 500 });
  }
}
