export function getConfig(){
  // Later vullen we dit met jouw echte config.json + env vars.
  // Nu: klein en voorspelbaar zodat je altijd "groen" blijft.
  return {
    boxId: process.env.BOX_ID || "dev-box",
    intervalMs: Number(process.env.HEARTBEAT_MS || 30000),
  };
}
