import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("http://47.98.178.174:8080/req/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        });

        const data = await response.json();

        if (!data.data) {
            return NextResponse.json({ message: "获取审核列表失败：无效的令牌" }, { status: 401 });
        }

        // console.log(data)
        const res = NextResponse.json(data);

        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "获取审核列表失败", error: error.message },
            { status: 500 }
        );
    }
}