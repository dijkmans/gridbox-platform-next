export type DataMode = "live" | "mock";

export function getApiOrigin(): string {
  const v = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (!v) throw new Error("NEXT_PUBLIC_API_ORIGIN ontbreekt in .env.local");
  return v.replace(/\/+$/, "");
}

export function getDataMode(): DataMode {
  const v = (process.env.NEXT_PUBLIC_DATA_MODE || "live").toLowerCase();
  return v === "mock" ? "mock" : "live";
}
