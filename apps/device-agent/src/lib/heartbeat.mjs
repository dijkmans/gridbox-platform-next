export async function heartbeat(cfg) {
  const timestamp = new Date().toISOString();
  
  // We simuleren hier systeemdata die de agent verzamelt
  const status = {
    boxId: cfg.boxId,
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
    timestamp: timestamp
  };

  console.log(`[HEARTBEAT] ${timestamp} boxId=${cfg.boxId} uptime=${status.uptime.toFixed(0)}s`);
  
  // We geven de status terug zodat main.mjs deze kan gebruiken in de API
  return status;
}
