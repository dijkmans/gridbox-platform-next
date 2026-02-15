import { getConfig } from "./config.mjs";
import { heartbeat } from "./heartbeat.mjs";

export async function main(){
  const cfg = getConfig();

  console.log("[DEVICE-AGENT] boot");
  console.log("[DEVICE-AGENT] config:", cfg);

  // 1x direct
  await heartbeat(cfg);

  // daarna periodiek
  setInterval(() => {
    heartbeat(cfg).catch((e) => console.error("[HEARTBEAT] error", e));
  }, cfg.intervalMs);
}
