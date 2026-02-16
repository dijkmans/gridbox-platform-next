const { execSync } = require('child_process');
const ID = "dev-box-01";
const PORTAL_URL = "http://192.168.10.167:3000"; // Je Windows IP

function i2cSet(relay, value) {
  try {
    const val = value ? "0xFF" : "0x00";
    execSync(`i2cset -y 1 0x10 ${relay} ${val}`);
    console.log(`[HARDWARE] Relais ${relay} geschakeld naar ${val}`);
  } catch (e) {
    console.log("❌ I2C Fout: Zit de kabel wel goed?");
  }
}

async function start() {
  console.log(`🚀 GridBox Agent ${ID} is gestart op de Pi!`);
  
  setInterval(async () => {
    try {
      // 1. Stuur Heartbeat
      await fetch(`${PORTAL_URL}/api/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ID, signal: 95, uptime: Math.floor(process.uptime()) })
      });

      // 2. Check voor Commando's
      const res = await fetch(`${PORTAL_URL}/api/command?id=${ID}`);
      if (res.status === 200) {
        const data = await res.json();
        if (data.action) {
          console.log(`⚡ RELAIS KLIK: ${data.action.toUpperCase()}`);
          const relay = data.action === "open" ? 1 : 2;
          i2cSet(relay, true);
          setTimeout(() => i2cSet(relay, false), 800);
        }
      }
    } catch (e) { console.log("Verbinding met PC verbroken..."); }
  }, 2000);
}

start();