import http from "node:http";
import { getConfig } from "./config.mjs";
import { heartbeat } from "./heartbeat.mjs";

export async function main() {
  const cfg = getConfig();
  const PORT = 8787;

  console.log("[DEVICE-AGENT] boot");

  // Start een simpele webserver voor de Portal
  const server = http.createServer((req, res) => {
    // Stel CORS in zodat de portal (op poort 3000) mag praten met de agent
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    if (req.url === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, service: "device-agent-live" }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT, () => {
    console.log(`[DEVICE-AGENT] API luistert op http://localhost:${PORT}`);
  });

  // 1x direct heartbeat
  await heartbeat(cfg);

  // In check-modus stoppen we de server en de app direct
  const runOnce = (process.env.RUN_ONCE || "").toLowerCase();
  if (runOnce === "1" || runOnce === "true" || runOnce === "yes") {
    console.log("[DEVICE-AGENT] RUN_ONCE=1 -> afsluiten");
    server.close();
    process.exit(0);
  }

  // Daarna periodiek de heartbeat loggen
  setInterval(() => {
    heartbeat(cfg).catch((e) => console.error("[HEARTBEAT] error", e));
  }, cfg.intervalMs);
}
