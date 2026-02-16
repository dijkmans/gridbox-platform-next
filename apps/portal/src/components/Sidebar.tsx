'use client';
import { GridBox } from "@prisma/client";
import { X, Camera, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ box, onClose }: { box: GridBox | null; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  if (!box) return null;

  const takePhoto = async () => {
    setLoading(true);
    await fetch("/api/command", {
      method: "POST",
      body: JSON.stringify({ id: box.id, action: "photo" }),
    });
    // Wacht 4 seconden op de Pi om de foto te maken en te uploaden
    setTimeout(() => {
      setPhotoUrl(`/uploads/${box.id}/latest.jpg?t=${Date.now()}`);
      setLoading(false);
    }, 4000);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 p-6 border-l border-gray-100 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900">Beheer Box</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
      </div>

      <div className="mb-8">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Camera Beeld</label>
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner group">
          {photoUrl ? (
            <img src={photoUrl} alt="Laatste foto" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Geen beeld beschikbaar</div>
          )}
          <button 
            onClick={takePhoto}
            disabled={loading}
            className="absolute bottom-3 right-3 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Camera />}
          </button>
        </div>
      </div>

      {/* Identiteit Sectie */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Locatie</label>
          <div className="p-3 bg-gray-50 rounded-lg text-black font-medium border border-gray-100">{box.site}</div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Klant</label>
          <div className="p-3 bg-gray-50 rounded-lg text-black font-medium border border-gray-100">{box.customer}</div>
        </div>
      </div>
    </div>
  );
}