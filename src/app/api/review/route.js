import { NextResponse } from "next/server";

export async function POST ( request) {
  const {type,userId} = await request.json();
  try{
    const response = await fetch("",{
          method: "POST",
          headers:{
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            userId
          }),
    })
    const data = await response.json();
    return NextResponse.json(data)
  }catch(error){
    return NextResponse.json(
      {message: "审核失败"},
      {status: 500}
    );
  }
}