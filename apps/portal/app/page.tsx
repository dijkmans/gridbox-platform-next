import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();
  const details = health.details;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gridbox Dashboard</h1>
          <p className="text-gray-600">Live systeemstatus van de device-agent</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Systeem Status</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              health.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.ok ? 'Verbonden' : 'Geen verbinding'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Box ID</p>
              <p className="text-lg font-mono text-gray-800">{details?.boxId || "dev-box"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Uptime</p>
              <p className="text-lg font-mono text-gray-800">
                {details?.uptime ? `${details.uptime.toFixed(0)}s` : "---"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Geheugen</p>
              <p className="text-lg font-mono text-gray-800">
                {details?.memory ? `${(details.memory / 1024 / 1024).toFixed(1)} MB` : "---"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Service</p>
              <p className="text-lg font-mono text-gray-800">{health.service}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
