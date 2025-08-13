import { NextResponse } from "next/server";

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
    const pathMod = await import("node:path");
    const fsPromises = await import("node:fs/promises");
    const dir = pathMod.join(process.cwd(), "public", "photos", slug);
    const entries = (await fsPromises.readdir(dir)) as string[];
    const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
    const files = entries
      .filter((name) => exts.has(pathMod.extname(name).toLowerCase()))
      .map((name) => name)
      .sort();
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}


