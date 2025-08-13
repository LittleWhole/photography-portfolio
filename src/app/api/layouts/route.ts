import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "src", "data", "layouts.json");

export async function GET() {
  try {
    const data = await fs.promises.readFile(FILE_PATH, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (auth !== "Basic " + Buffer.from("littlewhole:grideditor").toString("base64")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = (await req.json()) as unknown;
  // rudimentary validation: expect object of genre -> record(filename -> layout)
  if (typeof body !== "object" || body === null) {
    return new NextResponse("Bad Request", { status: 400 });
  }
  await fs.promises.writeFile(FILE_PATH, JSON.stringify(body, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}


