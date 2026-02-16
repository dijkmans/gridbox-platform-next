import { GridBox } from "@prisma/client";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "../utils/formatters";

export default function GridBoxRow({ box }: { box: GridBox }) {
  const router = useRouter();
  const sig = box.signal || 0;

  const handleAction = async (e: React.MouseEvent, action: string) => {
    e.stopPropagation(); // Voorkom dat de sidebar opent
    console.log("Klik op knop gedetecteerd:", action);

    const res = await fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: box.id, action }),
    });

    if (res.ok) {
      console.log("Commando succesvol verzonden naar server");
      router.refresh();
    } else {
      console.error("Server weigerde commando");
    }
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-all relative overflow-hidden group">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${box.shutterState === "open" ? "bg-green-500" : "bg-red-500"}`} />

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-tighter shadow-inner ${box.shutterState === "open" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
        {box.shutterState === "open" ? "OPEN" : "DICHT"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 text-black text-left">
          <h3 className="text-lg font-black truncate">{box.site || "Nieuwe Box"}</h3>
          <span className="text-gray-300 font-bold text-sm">#{box.boxNumber || "0"}</span>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-red-500 animate-pulse">❤️</span>
            <span className="text-[10px] font-bold text-gray-400">{formatTimeAgo(new Date(box.lastSeen))}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-full border border-gray-200">
            {box.customer || "Geen Klant"}
          </span>
          <div className="flex items-end gap-0.5 h-3 px-2">
            <div className={`w-1 h-[25%] rounded-full ${sig >= 5 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`w-1 h-[50%] rounded-full ${sig > 30 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`w-1 h-[75%] rounded-full ${sig > 60 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`w-1 h-[100%] rounded-full ${sig > 80 ? "bg-green-500" : "bg-gray-200"}`} />
            <span className={`text-[10px] font-bold ml-1 ${sig >= 5 ? "text-green-600" : "text-gray-400"}`}>
              {sig > 80 ? "4G Vol" : sig > 60 ? "Goed" : sig >= 5 ? "Matig" : "Zwak"}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => handleAction(e, box.shutterState === "open" ? "close" : "open")} 
        className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 z-10 
        ${box.shutterState === "open" ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        {box.shutterState === "open" ? "CLOSE" : "OPEN"}
      </button>
    </div>
  );
}