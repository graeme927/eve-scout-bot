import config from "./config.js"
import { getConnections } from "./eveScout.js"
import { send } from "./webhook.js"

// -----------------------------
// STATE
// -----------------------------
const lastState = {
  Thera: new Map(),
  Turnur: new Map()
}

// -----------------------------
// QUEUE
// -----------------------------
const queue = []
let sending = false

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function processQueue() {
  if (sending) return
  sending = true

  while (queue.length > 0) {
    const payload = queue.shift()

    try {
      await send(config.webhook, payload)
      console.log("📡 webhook sent")
    } catch (err) {
      console.error("❌ webhook failed:", err.message)
    }

    await sleep(1200)
  }

  sending = false
}

// -----------------------------
// MAIN SCAN
// -----------------------------
export async function scan() {
  console.log("\n🔄 EvE-Scout scan cycle starting")

  let data = []

  try {
    data = await getConnections()
  } catch (err) {
    console.error("❌ API error:", err.message)
    return
  }

  if (!Array.isArray(data)) {
    console.error("❌ invalid API response")
    return
  }

  const current = {
    Thera: new Map(),
    Turnur: new Map()
  }

  // -----------------------------
  // BUILD STATE
  // -----------------------------
  for (const sig of data) {

    const id = sig.id

    const inSystem = sig.in_system_name
    const outSystem = sig.out_system_name

    const hub = config.tracked.find(h =>
      inSystem === h || outSystem === h
    )

    if (!hub) continue

    current[hub].set(id, {
      system: inSystem,
      inSig: sig.in_signature,
      outSig: sig.out_signature,
      region: sig.in_region_name || sig.out_region_name || "Unknown",
      ship: sig.max_ship_size,
      hours: sig.remaining_hours
    })
  }

  // -----------------------------
  // DIFF + SEND
  // -----------------------------
  for (const hub of config.tracked) {

    const prev = lastState[hub]
    const curr = current[hub]

    for (const [id, v] of curr.entries()) {

      if (prev.has(id)) continue

      const title =
        hub === "Thera"
          ? "🟣 Thera Wormhole Intel"
          : "🔵 Turnur Wormhole Intel"

      const message =
`🛰️ **Wormhole Update**

**System:** ${v.system}

**IN Sig:** ${v.inSig || "Unknown"} (${hub} side)
**OUT Sig:** ${v.outSig || "Unknown"} (K-space side)

**Region:** ${v.region}
**Max Ship:** ${v.ship || "Unknown"}
**Remaining:** ${v.hours ? `${v.hours}h` : "Unknown"}
`

      queue.push({
        username: "EvE Scout",
        embeds: [
          {
            title,

            description: message,

            color: hub === "Thera" ? 0x9b59b6 : 0x3498db,

            timestamp: new Date()
          }
        ]
      })
    }

    lastState[hub] = curr
  }

  processQueue()

  console.log("✔ scan complete")
}
