import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gridBoxId = searchParams.get("gridBoxId");
  if (!gridBoxId) return NextResponse.json({ error: "ID missend" }, { status: 400 });

  const shares = await prisma.share.findMany({
    where: { gridBoxId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(shares);
}

export async function POST(req: Request) {
  const { gridBoxId, phone } = await req.json();
  const share = await prisma.share.create({
    data: { gridBoxId, phone },
  });
  return NextResponse.json(share);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID missend" }, { status: 400 });

  await prisma.share.delete({ where: { id } });
  return NextResponse.json({ success: true });
}