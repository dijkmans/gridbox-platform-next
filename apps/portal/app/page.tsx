import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();
  const details = health.details;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Gridbox Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Live systeemstatus van de device-agent</p>
        </header>

        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Systeem Status</h2>
            <div className="flex items-center gap-2">
              <span className={`relative flex h-3 w-3`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health.ok ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${health.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${health.ok ? 'text-green-600' : 'text-red-600'}`}>
                {health.ok ? 'Verbonden' : 'Geen verbinding'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Box ID</p>
              <p className="text-xl font-mono text-slate-900">{details?.boxId || "dev-box"}</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Uptime</p>
              <p className="text-xl font-mono text-slate-900">
                {details?.uptime ? `${details.uptime.toFixed(0)}s` : "---"}
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Geheugengebruik</p>
              <p className="text-xl font-mono text-slate-900">
                {details?.memory ? `${(details.memory / 1024 / 1024).toFixed(1)} MB` : "---"}
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">API Service</p>
              <p className="text-xl font-mono text-slate-900">{health.service}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
             <p className="text-xs text-slate-400 italic">Data ververst automatisch bij elke paginalaad-actie.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
