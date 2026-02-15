export async function heartbeat(cfg){
  const ts = new Date().toISOString();
  console.log(`[HEARTBEAT] ${ts} boxId=${cfg.boxId}`);
}
