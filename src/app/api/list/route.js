import { NextResponse } from "next/server";

export async function GET() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/req/list`, {
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