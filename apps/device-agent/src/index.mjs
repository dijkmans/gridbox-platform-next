import { main } from "./lib/main.mjs";
main().catch((e) => {
  console.error("[DEVICE-AGENT] FATAAL", e);
  process.exit(1);
});
