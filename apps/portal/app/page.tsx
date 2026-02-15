import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();
  // We halen de details op die de agent stuurt
  const details = health.details;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gridbox Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Live monitoring van de device-agent</p>
        </header>

        <main className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Systeem Status</h2>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health.ok ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${health.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${health.ok ? 'text-green-600' : 'text-red-600'}`}>
                {health.ok ? 'Operationeel' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard label="Box ID" value={details?.boxId || "dev-box"} />
            <StatCard label="Uptime" value={details?.uptime ? `${details.uptime.toFixed(0)}s` : "---"} />
            <StatCard 
              label="Geheugen" 
              value={details?.memory ? `${(details.memory / 1024 / 1024).toFixed(1)} MB` : "---"} 
            />
            <StatCard label="API Service" value={health.service} />
          </div>
          
          <footer className="mt-12 pt-6 border-t border-slate-50">
             <p className="text-center text-xs text-slate-400 font-medium italic">
               Laatste update: {new Date().toLocaleTimeString()}
             </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

// Een klein hulp-component voor de blokjes
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all group">
      <p className="text-xs text-slate-400 uppercase font-black mb-2 tracking-widest group-hover:text-blue-500">{label}</p>
      <p className="text-2xl font-mono font-bold text-slate-800">{value}</p>
    </div>
  );
}
