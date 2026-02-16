const { execSync } = require('child_process');
const fs = require('fs');
const ID = "dev-box-01";
const PORTAL_URL = "http://192.168.10.167:3000";

function i2cSet(relay, value) {
  try {
    const val = value ? "0xFF" : "0x00";
    execSync(`i2cset -y 1 0x10 ${relay} ${val}`);
    console.log(`[HARDWARE] Relais ${relay} geschakeld naar ${val}`);
  } catch (e) { console.log("❌ I2C Fout"); }
}

async function takeAndUploadPhoto() {
  try {
    console.log("📸 Foto maken...");
    // De libcamera-still opdracht van jouw Pi
    execSync(`libcamera-still -o /home/pi/latest.jpg --immediate --nopreview`);
    
    const fileBuffer = fs.readFileSync('/home/pi/latest.jpg');
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('id', ID);
    formData.append('image', blob, 'latest.jpg');

    await fetch(`${PORTAL_URL}/api/photos`, {
      method: 'POST',
      body: formData
    });
    console.log("✅ Foto succesvol verzonden naar de Portal!");
  } catch (e) { console.log("❌ Camera fout:", e.message); }
}

async function start() {
  console.log(`🚀 GridBox Agent ${ID} (Relais + Camera) is actief!`);
  
  setInterval(async () => {
    try {
      // 1. Heartbeat
      await fetch(`${PORTAL_URL}/api/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ID, signal: 98, uptime: Math.floor(process.uptime()) })
      });

      // 2. Poll voor commando's (Relais OF Foto)
      const res = await fetch(`${PORTAL_URL}/api/command?id=${ID}`);
      if (res.status === 200) {
        const data = await res.json();
        if (data.action === "photo") {
          await takeAndUploadPhoto();
        } else if (data.action === "open" || data.action === "closed") {
          console.log(`⚡ RELAIS: ${data.action.toUpperCase()}`);
          const relay = data.action === "open" ? 1 : 2;
          i2cSet(relay, true);
          setTimeout(() => i2cSet(relay, false), 800);
        }
      }
    } catch (e) { /* Stille verbinding */ }
  }, 2000);
}

start();