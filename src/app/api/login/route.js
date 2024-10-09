import { NextResponse } from "next/server";

export async function GET (request) {
  const {username,password} = await request.body();
  try{
    const resonse = await fetch("",{
          method: "POST",
          headers:{
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password
          }),
    })
    const data = await resonse.json();
    return NextResponse.json(data)
    ;
  }catch(error){
    return NextResponse.json(
      {message: "登陆失败"},
      {status: 500}
    );
  }
}