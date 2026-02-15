import http from "node:http";
import { getConfig } from "./config.mjs";
import { heartbeat } from "./heartbeat.mjs";

export async function main() {
  const cfg = getConfig();
  const PORT = 8787;
  let lastStatus = { ok: false, service: "booting" };

  console.log("[DEVICE-AGENT] boot");

  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    if (req.url === "/api/health") {
      // Haal de allerlaatste status op
      const status = await heartbeat(cfg);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        ok: true, 
        service: "device-agent-live",
        details: status 
      }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT, () => {
    console.log(`[DEVICE-AGENT] API luistert op http://localhost:${PORT}`);
  });

  // 1x direct uitvoeren voor de check
  await heartbeat(cfg);

  const runOnce = (process.env.RUN_ONCE || "").toLowerCase();
  if (runOnce === "1" || runOnce === "true" || runOnce === "yes") {
    console.log("[DEVICE-AGENT] RUN_ONCE=1 -> afsluiten");
    server.close();
    process.exit(0);
  }

  setInterval(() => {
    heartbeat(cfg).catch((e) => console.error("[HEARTBEAT] error", e));
  }, cfg.intervalMs);
}
