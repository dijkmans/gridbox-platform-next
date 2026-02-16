import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { id, site, customer } = await req.json();
    
    const updated = await prisma.gridBox.update({
      where: { id },
      data: { 
        site: site, 
        customer: customer 
      },
    });

    console.log(`✅ Box ${id} succesvol bijgewerkt!`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Database fout:", error);
    return NextResponse.json({ error: "Fout bij bijwerken" }, { status: 500 });
  }
}