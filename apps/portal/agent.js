const { execSync } = require('child_process');
const ID = "dev-box-01";
const PORTAL_URL = "http://localhost:3000"; // Pas dit aan naar het IP van je PC als je op de Pi draait

// Hardware instellingen uit jouw Pi-bestanden
const I2C_BUS = 1;
const I2C_ADDR = "0x10";
const RELAY_OPEN = 1;
const RELAY_CLOSE = 2; // Volgens jouw gridbox-export.txt

function i2cSet(relay, value) {
  try {
    // Dit commando werkt alleen op de Raspberry Pi
    const val = value ? "0xFF" : "0x00";
    execSync(`i2cset -y ${I2C_BUS} ${I2C_ADDR} ${relay} ${val}`);
    console.log(`[HARDWARE] I2C ${I2C_ADDR} Relay ${relay} -> ${val}`);
  } catch (e) {
    console.log(`[SIMULATIE] Relais ${relay} zou nu schakelen (i2cset faalde: waarschijnlijk niet op een Pi)`);
  }
}

async function sendStatus(state = "open") {
  const payload = {
    id: ID,
    shutterState: state,
    signal: 95,
    uptime: Math.floor(process.uptime())
  };
  try {
    await fetch(`${PORTAL_URL}/api/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) { console.log("❌ Portal onbereikbaar"); }
}

async function poll() {
  try {
    const res = await fetch(`${PORTAL_URL}/api/command?id=${ID}`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.action) {
        const relay = data.action === "open" ? RELAY_OPEN : RELAY_CLOSE;
        
        console.log(`⚡ RELAIS KLIK: Systeem gaat naar ${data.action.toUpperCase()}`);
        
        // 1. Relais AAN
        i2cSet(relay, true);
        await sendStatus(data.action === "open" ? "opening" : "closing");
        
        // 2. Wacht op beweging (puls)
        await new Promise(r => setTimeout(r, 800)); 
        
        // 3. Relais UIT
        i2cSet(relay, false);
        await sendStatus(data.action);
      }
    }
  } catch (err) { }
}

setInterval(() => sendStatus(), 5000);
setInterval(poll, 2000);
console.log(`🚀 Agent ${ID} klaar voor ECHTE hardware...`);