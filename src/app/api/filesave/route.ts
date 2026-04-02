import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 1. 저장할 디렉토리 경로 설정 (프로젝트 루트의 NewWorkflows 폴더)
    const dirPath = path.join(process.cwd(), "NewWorkflows");
    const filePath = path.join(dirPath, `${data.name}.json`);

    // 2. 폴더가 없으면 생성
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 3. JSON 파일 쓰기
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "파일 저장 완료!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
