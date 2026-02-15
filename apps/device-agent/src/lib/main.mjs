import { getConfig } from "./config.mjs";
import { heartbeat } from "./heartbeat.mjs";

export async function main(){
  const cfg = getConfig();

  console.log("[DEVICE-AGENT] boot");
  console.log("[DEVICE-AGENT] config:", cfg);

  // 1x direct
  await heartbeat(cfg);

  // In check-modus willen we direct stoppen
  const runOnce = (process.env.RUN_ONCE || "").toLowerCase();
  if (runOnce === "1" || runOnce === "true" || runOnce === "yes") {
    console.log("[DEVICE-AGENT] RUN_ONCE=1 -> exit");
    process.exit(0);
  }

  // daarna periodiek
  setInterval(() => {
    heartbeat(cfg).catch((e) => console.error("[HEARTBEAT] error", e));
  }, cfg.intervalMs);
}
