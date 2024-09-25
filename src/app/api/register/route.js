import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password, type } = await request.json();

  try{
    fetch("", {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
                    },
        body: JSON.stringify({
          username,
          password,
          type
        }),
    }).then((res) => {
      return NextResponse.json(res.json()) 
    });
  }catch(error){
    return NextResponse.json({ message: "注册失败" }, { status: 500 });
  }
}
