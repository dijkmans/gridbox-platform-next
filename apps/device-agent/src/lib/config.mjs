import fs from "node:fs";
import path from "node:path";

function asInt(value, fallback) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("[CONFIG] config file read/parse failed:", filePath, e?.message ?? e);
    return null;
  }
}

export function getConfig() {
  const defaults = {
    boxId: "dev-box",
    intervalMs: 30000,
  };

  // 1) env overrides
  const envCfg = {
    boxId: process.env.BOX_ID || undefined,
    intervalMs: process.env.INTERVAL_MS ? asInt(process.env.INTERVAL_MS, defaults.intervalMs) : undefined,
  };

  // 2) file overrides
  // default: repo/apps/device-agent/config/config.json
  const defaultPath = path.resolve(process.cwd(), "config", "config.json");
  const cfgPath = process.env.DEVICE_AGENT_CONFIG
    ? path.resolve(process.cwd(), process.env.DEVICE_AGENT_CONFIG)
    : defaultPath;

  const fileCfg = safeReadJson(cfgPath) || {};

  const cfg = {
    boxId: fileCfg.boxId ?? envCfg.boxId ?? defaults.boxId,
    intervalMs: fileCfg.intervalMs ?? envCfg.intervalMs ?? defaults.intervalMs,
  };

  return cfg;
}
