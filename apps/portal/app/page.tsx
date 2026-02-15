import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();
  // Veiligheid: als details ontbreken, gebruik lege objecten
  const details = health.details || { boxId: 'loading...', uptime: 0, memory: 0 };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Gridbox Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Live monitoring van de device-agent
          </p>
        </header>

        {/* Main Card */}
        <main className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          
          {/* Status Balk */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Systeem Status</h2>
            
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${health.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health.ok ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${health.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${health.ok ? 'text-green-700' : 'text-red-700'}`}>
                {health.ok ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* Grid met blokjes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box ID */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Box ID</p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {details.boxId || "Onbekend"}
              </p>
            </div>

            {/* Uptime */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Uptime</p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {details.uptime ? `${Number(details.uptime).toFixed(0)} sec` : "0 sec"}
              </p>
            </div>

            {/* Geheugen */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Geheugen</p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {details.memory ? `${(Number(details.memory) / 1024 / 1024).toFixed(1)} MB` : "0 MB"}
              </p>
            </div>

            {/* API Service */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Service</p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {health.service || "---"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
