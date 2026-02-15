import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gridbox Dashboard</h1>
          <p className="text-gray-600">Systeemstatus en beheer</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">API Verbinding</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              health.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.ok ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span>Service:</span>
              <span className="font-mono">{health.service || "Onbekend"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span>Status code:</span>
              <span className="font-mono">{health.ok ? "200 OK" : "Error"}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
