import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, shutterState, signal, uptime } = data;

    // We gebruiken upsert: als hij niet bestaat maakt hij hem, als hij bestaat update hij hem.
    const updated = await prisma.gridBox.upsert({
      where: { id: id.trim() },
      update: { 
        lastSeen: new Date(),
        status: "ONLINE",
        // Forceer kleine letters voor de status (open/closed)
        shutterState: shutterState ? shutterState.toLowerCase() : undefined,
        signal: signal ? Number(signal) : undefined,
        uptime: uptime ? Number(uptime) : undefined,
      },
      create: {
        id: id.trim(),
        site: "Geel",
        customer: "Powergrid",
        status: "ONLINE",
        shutterState: shutterState ? shutterState.toLowerCase() : "closed",
        signal: Number(signal) || 100,
        lastSeen: new Date(),
      }
    });

    console.log(`📡 DB UPDATE: Box ${id} is nu ${updated.shutterState} (Signaal: ${updated.signal}%)`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fout bij opslaan heartbeat:", error);
    return NextResponse.json({ error: "Fout" }, { status: 500 });
  }
}