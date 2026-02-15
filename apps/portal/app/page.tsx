import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();
  const details = health.details || { boxId: 'loading...', uptime: 0, memory: 0 };

  return (
    <div className="min-h-screen p-8 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Gridbox Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Live monitoring van de device-agent
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Systeem Status</h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${health.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`w-3 h-3 rounded-full ${health.ok ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className={`text-sm font-bold uppercase ${health.ok ? 'text-green-700' : 'text-red-700'}`}>
                {health.ok ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="Box ID" value={details.boxId || "Onbekend"} />
            <StatCard label="Uptime" value={details.uptime ? `${Number(details.uptime).toFixed(0)} sec` : "0 sec"} />
            <StatCard label="Geheugen" value={details.memory ? `${(Number(details.memory) / 1024 / 1024).toFixed(1)} MB` : "0 MB"} />
            <StatCard label="Service" value={health.service || "---"} />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">{label}</p>
      <p className="text-2xl font-mono font-bold text-slate-800">{value}</p>
    </div>
  );
}
