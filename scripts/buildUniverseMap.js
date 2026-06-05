import fs from "fs"

console.log("🌍 Building CLEAN EVE universe map...")

fs.mkdirSync("./data", { recursive: true })

// -----------------------------
// REGIONS (SAFE)
// -----------------------------
const regions = {}

const regionIds = await fetch(
"https://esi.evetech.net/latest/universe/regions/"
).then(r => r.json())

for (const id of regionIds) {
  const data = await fetch(
    `https://esi.evetech.net/latest/universe/regions/${id}/`
  ).then(r => r.json())

  regions[String(id)] = data.name
}

// -----------------------------
// SYSTEMS (FIXED APPROACH)
// -----------------------------
const systemIds = await fetch(
"https://esi.evetech.net/latest/universe/systems/"
).then(r => r.json())

if (!Array.isArray(systemIds) || systemIds.length === 0) {
  throw new Error("ESI returned empty system list")
}

console.log(`📦 systems found: ${systemIds.length}`)

const systems = {}

let ok = 0
let bad = 0

for (const id of systemIds) {

try {

const sys = await fetch(
`https://esi.evetech.net/latest/universe/systems/${id}/`
).then(r => r.json())

// CRITICAL VALIDATION (this fixes your bug)
if (!sys || !sys.region_id || !sys.name) {
bad++
continue
}

systems[String(id)] = {
name: sys.name,
region_id: String(sys.region_id)
}

ok++

} catch (e) {
bad++
}

}

fs.writeFileSync(
"./data/regions.json",
JSON.stringify(regions, null, 2)
)

fs.writeFileSync(
"./data/systems.json",
JSON.stringify(systems, null, 2)
)

console.log("✔ systems OK:", ok)
console.log("⚠ systems BAD:", bad)
console.log("🎉 universe map COMPLETE")
