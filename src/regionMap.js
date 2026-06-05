import fs from "fs"

const systems = JSON.parse(
fs.readFileSync("./data/systems.json", "utf-8")
)

const regions = JSON.parse(
fs.readFileSync("./data/regions.json", "utf-8")
)

export function getRegion(systemId) {

const sys = systems[String(systemId)]

if (!sys?.region_id) return "Unknown"

return regions[String(sys.region_id)] || "Unknown"

}
