import { getApiOrigin, getDataMode } from "./env";
import { getJson } from "./http";

export type Health = { ok: boolean; service?: string };

function apiUrl(path: string): string {
  const origin = getApiOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}/api${p}`;
}

export async function getHealth(): Promise<Health> {
  const mode = getDataMode();
  if (mode === "mock") return { ok: true, service: "mock" };
  return getJson<Health>(apiUrl("/health"));
}
