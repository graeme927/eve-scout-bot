import config from "./config.js"
import { getConnections } from "./eveScout.js"
import { send } from "./webhook.js"

import {
  loadSeen,
  hasSeen,
  markSeen
} from "./state.js"

// --------------------
// INIT
// --------------------

loadSeen()

let running = false

// --------------------
// WEBHOOK QUEUE
// --------------------

const queue = []

let sending = false

function sleep(ms) {
  return new Promise(
    r => setTimeout(r, ms)
  )
}

async function processQueue() {

  if (sending)
    return

  sending = true

  while (
    queue.length
  ) {

    const payload =
      queue.shift()

    try {

      await send(
        config.webhook,
        payload
      )

      console.log(
        "📡 webhook sent"
      )

    }

    catch (err) {

      console.error(
        "❌ webhook failed:",
        err.message
      )

    }

    await sleep(1200)

  }

  sending = false

}

// --------------------
// MAIN SCAN
// --------------------

export async function scan() {

  if (running) {

    console.log(
      "⏭ scan skipped"
    )

    return

  }

  running = true

  try {

    console.log(
      "\n🔄 EvE-Scout scan cycle starting"
    )

    const data =
      await getConnections()

    if (
      !Array.isArray(data)
    ) {

      console.error(
        "❌ Invalid response"
      )

      return

    }

    for (
      const sig
      of data
    ) {

      const id =
        String(sig.id)

      if (
        hasSeen(id)
      ) {
        continue
      }

      const inSystem =
        sig.in_system_name

      const outSystem =
        sig.out_system_name

      const hub =
        config.tracked.find(
          h =>
            inSystem === h ||
            outSystem === h
        )

      if (
        !hub
      ) {
        continue
      }

      const destination =
        inSystem === hub
          ? outSystem
          : inSystem

      const region =
        sig.in_region_name ||
        sig.out_region_name ||
        "Unknown"

      // --------------------
      // REGION FILTER
      // --------------------

      if (

        config.filterRegions.length > 0 &&

        !config.filterRegions.includes(
          region.toLowerCase()
        )

      ) {

        console.log(
          `⏭ Region filtered: ${region}`
        )

        continue

      }

      console.log(
        `🆕 ${hub} → ${destination}`
      )

      // --------------------
      // EMBED FORMAT
      // --------------------

      queue.push({

        username:
          "EvE Scout",

        embeds: [

          {

            title:
              `New ${hub} Connection to ${region}`,

            color:
              hub === "Thera"
                ? 0x9b59b6
                : 0xf39c12,

            fields: [

              {

                name:
                  "Connection",

                value:
                  `${hub} → ${destination}`,

                inline:
                  false

              },

              {

                name:
                  "Details",

                value:

`Wormhole Type: ${
sig.wh_type || "Unknown"
}

Max Ship Size: ${
sig.max_ship_size || "Unknown"
}

Time Remaining: ${
sig.remaining_hours
? `${sig.remaining_hours} hours`
: "Unknown"
}`,

                inline:
                  true

              },

              {

                name:
                  "Region",

                value:
                  region,

                inline:
                  true

              },

              {

                name:
                  "Signatures",

                value:

`${hub}: ${
sig.in_signature || "Unknown"
}

${destination}: ${
sig.out_signature || "Unknown"
}`,

                inline:
                  false

              }

            ],

            footer: {

              text:
                "EvE Scout API"

            },

            timestamp:
              new Date()

          }

        ]

      })

      markSeen(
        id
      )

    }

    await processQueue()

    console.log(
      "✔ scan complete"
    )

  }

  catch (err) {

    console.error(
      "❌ Scan failed:",
      err.message
    )

  }

  finally {

    running = false

  }

}
