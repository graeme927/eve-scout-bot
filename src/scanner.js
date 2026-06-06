import config from "./config.js"
import { getConnections } from "./eveScout.js"
import { send } from "./webhook.js"

import {
  loadSeen,
  hasSeen,
  markSeen
}
from "./state.js"

loadSeen()

let running = false

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
        "❌ webhook:",
        err.message
      )

    }

    await sleep(1200)

  }

  sending = false

}

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
      "\n🔄 scan starting"
    )

    const data =
      await getConnections()

    if (
      !Array.isArray(
        data
      )
    ) {

      console.log(
        "❌ invalid response"
      )

      return

    }

    for (
      const sig
      of data
    ) {

      const id =
        String(
          sig.id
        )

      if (
        hasSeen(id)
      ) {
        continue
      }

      const hub =
        config.tracked.find(
          h =>
            sig.in_system_name === h ||
            sig.out_system_name === h
        )

      if (
        !hub
      )
        continue

      const region =

        sig.in_region_name ||

        sig.out_region_name ||

        "Unknown"

      if (

        config.filterRegions.length &&

        !config.filterRegions.includes(
          region.toLowerCase()
        )

      ) {

        console.log(
          `⏭ filtered ${region}`
        )

        continue

      }

      const payload = {

        username:
          "EvE Scout",

        embeds: [

          {

            title:
              hub === "Thera"
                ? "🟣 Thera Wormhole Intel"
                : "🔵 Turnur Wormhole Intel",

            description:

`**System:** ${
sig.in_system_name === hub
? sig.out_system_name
: sig.in_system_name
}

**IN Sig:** ${
sig.in_signature
}

**OUT Sig:** ${
sig.out_signature
}

**Region:** ${
region
}

**Max Ship:** ${
sig.max_ship_size
}

**Remaining:** ${
sig.remaining_hours
}h`,

            color:
              hub === "Thera"
                ? 0x9b59b6
                : 0x3498db

          }

        ]

      }

      queue.push(
        payload
      )

      markSeen(id)

    }

    await processQueue()

  }

  finally {

    running = false

  }

}
