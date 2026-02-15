# Gridbox Platform Next - Start Here

Dit is de bouwplaats (next). Productie staat apart en mag nooit stilvallen door werk hier.

## Wat werkt nu
Portal (Next.js) buildt.
Device-agent skeleton start.

## 1) Repo check
Altijd eerst dit draaien vanaf repo root:

powershell:
  .\scripts\check.ps1

Als dit groen is, mag je pas verder bouwen.

## 2) Portal starten
Vanuit repo root:

  cd apps/portal
  npm install
  npm run build
  npm run dev

Portal verwacht een API origin via:
  apps/portal/.env.local

Voorbeeld:
  NEXT_PUBLIC_API_ORIGIN=http://localhost:8787

Let op: .env.local staat in .gitignore.

## 3) Device-agent starten
Vanuit repo root:

  cd apps/device-agent
  npm run start

Doel: dit blijft altijd een simpele start-check.

## Werkwijze regels (kort)
1 wijziging per PR.
Na elke PR moet .\scripts\check.ps1 groen zijn.
Legacy code komt in apps/device-agent/legacy en blijft read-only.
