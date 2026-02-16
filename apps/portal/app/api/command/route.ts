import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

// Gebruik een globale variabele die blijft bestaan bij herladen
const globalCommands = global as any;
if (!globalCommands._pending) {
  globalCommands._pending = {};
}

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();
    globalCommands._pending[id] = action;
    
    console.log(`>>> [DASHBOARD] Commando klaargezet voor ${id}: ${action}`);

    // Log in database voor de sidebar
    await prisma.event.create({
      data: {
        gridBoxId: id,
        type: "COMMAND",
        message: `Box ${action === "open" ? "geopend" : "gesloten"} via Dashboard`,
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Fout" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id || !globalCommands._pending[id]) {
    return new Response(null, { status: 204 }); 
  }
  
  const action = globalCommands._pending[id];
  delete globalCommands._pending[id]; // Haal het uit de wachtrij
  
  console.log(`>>> [AGENT] Box ${id} haalt op: ${action}`);
  return NextResponse.json({ action });
}