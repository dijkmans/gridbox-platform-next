import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const boxId = formData.get("id") as string;

    if (!file) return NextResponse.json({ error: "Geen foto" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = join(process.cwd(), "public", "uploads", boxId);
    
    // Zorg dat de map bestaat
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `latest.jpg`;
    await writeFile(join(uploadDir, fileName), buffer);

    console.log(`📸 Foto ontvangen van Box ${boxId}`);
    return NextResponse.json({ success: true, url: `/uploads/${boxId}/${fileName}` });
  } catch (error) {
    console.error("Foto upload fout:", error);
    return NextResponse.json({ error: "Upload mislukt" }, { status: 500 });
  }
}