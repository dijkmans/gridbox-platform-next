import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gridBoxId = searchParams.get("gridBoxId");

  if (!gridBoxId) return NextResponse.json({ error: "ID missend" }, { status: 400 });

  const events = await prisma.event.findMany({
    where: { gridBoxId },
    orderBy: { createdAt: "desc" },
    take: 10, // We tonen de laatste 10 events
  });

  return NextResponse.json(events);
}