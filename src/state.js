import fs from "fs"

const FILE = "./data/seen.json"

let seen = new Set()

try {
  if (fs.existsSync(FILE)) {
    seen = new Set(JSON.parse(fs.readFileSync(FILE)))
  }
} catch {}

export function hasSeen(id) {
  return seen.has(String(id))
}

export function markSeen(id) {
  seen.add(String(id))

  fs.mkdirSync("./data", { recursive: true })

  fs.writeFileSync(
    FILE,
    JSON.stringify([...seen], null, 2)
  )
}
