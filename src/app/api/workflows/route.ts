import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "NewWorkflows");

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json([]);
    }

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
