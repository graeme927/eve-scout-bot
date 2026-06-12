import fs from "fs"

const FILE = "./data/state.json"

let state = {}

export function loadState() {

  try {

    fs.mkdirSync("./data", { recursive: true })

    if (fs.existsSync(FILE)) {
      state = JSON.parse(fs.readFileSync(FILE, "utf8"))
    }

    console.log(
      `📦 Loaded ${Object.keys(state).length} signatures`
    )

  } catch (err) {
    console.error("state load error:", err.message)
  }
}

export function saveState() {
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2))
}

export function getState() {
  return state
}
