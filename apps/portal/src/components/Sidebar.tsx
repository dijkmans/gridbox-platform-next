'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridBox, Event, Share } from "@prisma/client";
import { formatTimeAgo } from "../utils/formatters";

const COUNTRY_CODES = [
  { code: "+32", name: "BE" },
  { code: "+31", name: "NL" },
  { code: "+49", name: "DE" },
  { code: "+33", name: "FR" },
  { code: "+44", name: "UK" },
];

export default function Sidebar({ box, onClose }: { box: GridBox | null, onClose: () => void }) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [site, setSite] = useState("");
  const [customer, setCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("+32"); // Standaard België

  const fetchData = async () => {
    if (!box) return;
    const [evRes, shRes] = await Promise.all([
      fetch(`/api/events?gridBoxId=${box.id}`),
      fetch(`/api/shares?gridBoxId=${box.id}`)
    ]);
    setEvents(await evRes.json());
    setShares(await shRes.json());
  };

  useEffect(() => {
    if (box) {
      setSite(box.site || "");
      setCustomer(box.customer || "");
      fetchData();
    }
  }, [box]);

  const addShare = async () => {
    if (!newPhone || !box) return;
    
    // Combineer landcode met het nummer (verwijder eventuele dubbele + tekens)
    const fullNumber = `${selectedCountry}${newPhone.replace(/^0+/, '')}`;

    await fetch("/api/shares", {
      method: "POST",
      body: JSON.stringify({ gridBoxId: box.id, phone: fullNumber }),
    });
    setNewPhone("");
    fetchData();
  };

  const deleteShare = async (id: string) => {
    await fetch(`/api/shares?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  if (!box) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl border-l z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-black text-blue-900">Beheer Box</h2>
        <button onClick={onClose} className="text-gray-400 text-2xl hover:text-black">✕</button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-8 text-black">
        {/* IDENTITEIT EN STATUS (Bekend) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identiteit</h3>
          <input value={site} readOnly className="w-full bg-gray-100 border p-3 rounded-xl text-sm italic text-gray-500" />
          <input value={customer} readOnly className="w-full bg-gray-100 border p-3 rounded-xl text-sm italic text-gray-500" />
        </div>

        {/* TOEGANG VERLENEN MET LANDCODE */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Toegang Verlenen</h3>
          <div className="flex gap-2">
            {/* Landcode Selector */}
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-sm font-bold focus:outline-none"
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
              ))}
            </select>

            <input 
              type="text" 
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="470 12 34 56"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
            <button onClick={addShare} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black">
              Voeg toe
            </button>
          </div>
          
          <div className="space-y-2">
            {shares.map(s => (
              <div key={s.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="font-mono text-sm font-bold text-gray-700">{s.phone}</span>
                <button onClick={() => deleteShare(s.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Verwijder</button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITEIT LOGBOEK (Bekend) */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activiteit Logboek</h3>
          <div className="space-y-4 border-l-2 border-gray-100 ml-2 pl-4">
            {events.map(e => (
              <div key={e.id} className="relative">
                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-sm font-bold text-gray-800">{e.message}</p>
                <p className="text-[10px] text-gray-400 uppercase">{formatTimeAgo(new Date(e.createdAt))}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}