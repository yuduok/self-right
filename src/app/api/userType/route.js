import { NextResponse } from "next/server";

export async function POST(request) {

    const { token } = await request.json();
    console.log(token);
    try {
        const response = await fetch("http://47.98.178.174:8080/user/gettype", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        });

        const data = await response.json();

        console.log(data);

        if (!data.data) {
            return NextResponse.json({ message: "获取用户类型失败：无效的令牌" }, { status: 401 });
        }

        const res = NextResponse.json(data);

        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "获取用户类型失败", error: error.message },
            { status: 500 }
        );
    }
}