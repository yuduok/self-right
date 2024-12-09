import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("http://47.98.178.174:8080/load1", {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("无法下载文件");
    }

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=\"downloaded_file.ext\"",
      },
    });
  } catch (error) {
    console.error("下载文件失败:", error);
    return NextResponse.json(
      { message: "下载文件失败" },
      { status: 500 }
    );
  }
}