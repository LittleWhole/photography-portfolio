import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Use manifest instead of filesystem scanning to avoid bundling photos
    const photosManifest = (await import("@/data/photos-manifest.json")).default as { genres?: Record<string, { files: { filename: string; width: number; height: number }[] }> };
    const genreData = photosManifest.genres?.[slug];
    
    if (!genreData) {
      return NextResponse.json({ files: [] });
    }
    
    const files = genreData.files.map(f => f.filename);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ files: [] });
  }
}


