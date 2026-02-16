import os from 'os';

const CONFIG = {
  portalUrl: 'http://localhost:3000/api/heartbeat',
  boxId: 'dev-box-01',
  site: 'Geel',
  boxNumber: '1'
};

let currentLocalState = "closed";

async function sendHeartbeat() {
  const data = { id: CONFIG.boxId, site: CONFIG.site, boxNumber: CONFIG.boxNumber, uptime: Math.floor(process.uptime()), memory: Math.floor(os.totalmem() / 1024 / 1024) };

  try {
    const response = await fetch(CONFIG.portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { shutterState } = await response.json();
      
      if (shutterState !== currentLocalState) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚙️ ACTIE: Shutter gaat van ${currentLocalState} naar ${shutterState}!`);
        currentLocalState = shutterState;
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Status OK: ${currentLocalState}`);
      }
    }
  } catch (error) {
    console.error("📡 Offline...");
  }
}

setInterval(sendHeartbeat, 5000);
sendHeartbeat();