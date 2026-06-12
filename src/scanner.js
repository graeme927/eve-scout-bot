import config from "./config.js"
import { getConnections } from "./eveScout.js"
import { send } from "./webhook.js"

import {
  loadState,
  saveState,
  getState
} from "./state.js"

loadState()

let running = false

const queue = []
let sending = false

const MISSING_THRESHOLD = 3

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function processQueue() {

  if (sending) return
  sending = true

  while (queue.length) {

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

export async function scan() {

  if (running) return
  running = true

  try {

    console.log("\n🔄 EvE-Scout scan cycle starting")

    const data = await getConnections()
    if (!Array.isArray(data)) return

    const state = getState()

    const currentIds = new Set()

    // -----------------------------
    // PROCESS ACTIVE CONNECTIONS
    // -----------------------------

    for (const sig of data) {

      const id = String(sig.id)
      currentIds.add(id)

      const inSystem = sig.in_system_name
      const outSystem = sig.out_system_name

      const hub = config.tracked.find(
        h => inSystem === h || outSystem === h
      )

      if (!hub) continue

      const destination =
        inSystem === hub ? outSystem : inSystem

      const region =
        sig.in_region_name ||
        sig.out_region_name ||
        "Unknown"

      if (
        config.filterRegions.length &&
        !config.filterRegions.includes(region.toLowerCase())
      ) continue

      // -----------------------------
      // NEW CONNECTION
      // -----------------------------

      if (!state[id]) {

        console.log(`🆕 ${hub} → ${destination}`)

        queue.push({
          username: "EvE Scout",
          embeds: [{
            title: `New ${hub} Connection to ${region}`,

            color:
              hub === "Thera"
                ? 0x9b59b6
                : 0xf39c12,

            fields: [
              {
                name: "Connection",
                value: `${hub} → ${destination}`
              },
              {
                name: "Region",
                value: region,
                inline: true
              },
              {
                name: "Signatures",
                value:
`${hub}: ${sig.in_signature || "Unknown"}
${destination}: ${sig.out_signature || "Unknown"}`
              }
            ],

            timestamp: new Date()
          }]
        })

        state[id] = {
          hub,
          destination,
          region,
          missingCount: 0,
          firstSeen: Date.now(),
          lastSeen: Date.now()
        }

        continue
      }

      // -----------------------------
      // UPDATE EXISTING
      // -----------------------------

      state[id].lastSeen = Date.now()
      state[id].missingCount = 0
    }

    // -----------------------------
    // DETECT REMOVED CONNECTIONS
    // -----------------------------

    for (const [id, sig] of Object.entries(state)) {

      if (currentIds.has(id)) continue

      sig.missingCount++

      if (sig.missingCount >= MISSING_THRESHOLD) {

        console.log(`🔴 Closed ${sig.hub} → ${sig.destination}`)

        queue.push({
          username: "EvE Scout",
          embeds: [{
            title: `Closed ${sig.hub} Connection to ${sig.region}`,

            color: 0xe74c3c,

            fields: [
              {
                name: "Connection",
                value: `${sig.hub} → ${sig.destination}`
              },
              {
                name: "Region",
                value: sig.region
              }
            ],

            timestamp: new Date()
          }]
        })

        delete state[id]

      }
    }

    saveState()

    await processQueue()

    console.log("✔ scan complete")

  } finally {
    running = false
  }
}
