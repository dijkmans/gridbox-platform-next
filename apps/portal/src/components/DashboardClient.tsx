'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridBox } from "@prisma/client";
import GridBoxRow from "./GridBoxRow";
import Sidebar from "./Sidebar";

export default function DashboardClient({ initialBoxes }: { initialBoxes: GridBox[] }) {
  const router = useRouter();
  const [selectedBox, setSelectedBox] = useState<GridBox | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKlant, setFilterKlant] = useState("Alle klanten");
  const [filterLocatie, setFilterLocatie] = useState("Alle locaties");

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  // Filter logica
  const filteredBoxes = initialBoxes.filter(box => {
    const matchesSearch = 
      (box.site?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (box.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (box.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesKlant = filterKlant === "Alle klanten" || box.customer === filterKlant;
    const matchesLocatie = filterLocatie === "Alle locaties" || box.site === filterLocatie;

    return matchesSearch && matchesKlant && matchesLocatie;
  });

  const groupedBoxes = filteredBoxes.reduce((acc, box) => {
    const site = box.site || "Onbekende Locatie";
    if (!acc[site]) acc[site] = [];
    acc[site].push(box);
    return acc;
  }, {} as Record<string, GridBox[]>);

  const klanten = Array.from(new Set(initialBoxes.map(b => b.customer).filter(Boolean)));
  const locaties = Array.from(new Set(initialBoxes.map(b => b.site).filter(Boolean)));

  return (
    <div className="relative">
      {/* HET KEUZEMENU (ZOEKBALK + FILTERS) */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Zoek op box, site of klant..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer text-black"
          value={filterKlant}
          onChange={(e) => setFilterKlant(e.target.value)}
        >
          <option value="Alle klanten">Alle klanten</option>
          {klanten.map(k => <option key={k} value={k!}>{k}</option>)}
        </select>
        <select 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer text-black"
          value={filterLocatie}
          onChange={(e) => setFilterLocatie(e.target.value)}
        >
          <option value="Alle locaties">Alle locaties</option>
          {locaties.map(l => <option key={l} value={l!}>{l}</option>)}
        </select>
      </div>

      {/* DE BOXEN LIJST */}
      {Object.entries(groupedBoxes).map(([site, siteBoxes]) => (
        <div key={site} className="mb-12">
          <h2 className="text-xl font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
            {site}
            <div className="h-px bg-gray-200 flex-1" />
          </h2>
          <div className="space-y-4">
            {siteBoxes.map((box) => (
              <div key={box.id} onClick={() => setSelectedBox(box)} className="cursor-pointer">
                <GridBoxRow box={box} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedBox && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSelectedBox(null)} />
      )}
      <Sidebar box={selectedBox} onClose={() => setSelectedBox(null)} />
    </div>
  );
}