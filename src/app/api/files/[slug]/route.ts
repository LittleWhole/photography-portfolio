import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Prevent bundling public/photos into a serverless function on Vercel
  if (process.env.VERCEL) {
    return NextResponse.json({ files: [] });
  }

  const { slug } = await params;
  try {
    const dir = path.join(process.cwd(), "public", "photos", slug);
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
    const files = entries
      .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
      .map((e) => e.name)
      .sort();
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}


