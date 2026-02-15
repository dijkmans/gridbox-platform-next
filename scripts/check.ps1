$ErrorActionPreference = "Stop"

function Say($msg) { Write-Host $msg }
function Fail($msg) { Write-Host ""; Write-Host "FOUT: $msg"; exit 1 }

# Must run from repo root
if (-not (Test-Path ".git")) { Fail "Run dit in de repo root (map met .git)." }

Say ""
Say "== Gridbox Platform Next check =="
Say ("Repo: " + (Get-Location))

# 1) Portal build
if (-not (Test-Path "apps/portal/package.json")) { Fail "apps/portal/package.json niet gevonden." }

Say ""
Say "== Portal: npm install + build =="
Push-Location "apps/portal"

npm install | Out-Host
npm run build | Out-Host

Pop-Location

# 2) Device-agent start (non-blocking via RUN_ONCE)
if (-not (Test-Path "apps/device-agent/package.json")) { Fail "apps/device-agent/package.json niet gevonden." }

Say ""
Say "== Device-agent: start =="
Push-Location "apps/device-agent"

npm install | Out-Host

$env:RUN_ONCE = "1"
npm run start | Out-Host
Remove-Item Env:\RUN_ONCE -ErrorAction SilentlyContinue

Pop-Location

Say ""
Say "OK: alles groen"
