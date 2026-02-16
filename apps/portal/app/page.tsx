import { prisma } from "../src/lib/prisma";
import DashboardClient from "../src/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const boxes = await prisma.gridBox.findMany({
    orderBy: { site: "asc" },
  });

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-black">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight">
            GRIDBOX <span className="text-blue-500">PORTAL</span>
          </h1>
          <p className="text-gray-500 font-medium">Beheer al je locaties op één plek</p>
        </div>
        <div className="bg-white px-6 py-3 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold text-gray-700">{boxes.length} Boxen Online</span>
        </div>
      </header>

      {/* Geen statistieken meer, direct naar de lijst */}
      <DashboardClient initialBoxes={boxes} />
    </div>
  );
}