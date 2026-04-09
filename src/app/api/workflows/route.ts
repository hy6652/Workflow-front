import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const dirPath = path.join(process.cwd(), "NewWorkflows");

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json([]);
    }

    // 특정 파일의 내용만 읽어오는 경우
    if (fileName) {
      const filePath = path.join(dirPath, fileName);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
      }
      const raw = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json(JSON.parse(raw));
    }

    // 파일 목록을 읽어오는 경우
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));

    const workflows = files.map((file) => {
      const raw = fs.readFileSync(path.join(dirPath, file), "utf-8");
      const parsed = JSON.parse(raw);
      return {
        id: parsed.id ?? file.replace(".json", ""),
        name: parsed.name ?? file.replace(".json", ""),
        fileName: file,
      };
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "불러오기 실패" }, { status: 500 });
  }
}
