import fs from "fs"

const FILE = "./data/seen.json"

let seen = new Set()

export function loadSeen() {

  try {

    fs.mkdirSync(
      "./data",
      { recursive: true }
    )

    if (
      fs.existsSync(FILE)
    ) {

      const data =
        JSON.parse(
          fs.readFileSync(
            FILE,
            "utf8"
          )
        )

      seen =
        new Set(data)

      console.log(
        `📦 Loaded ${seen.size} seen IDs`
      )

    }

  }

  catch (err) {

    console.error(
      "❌ seen.json load failed:",
      err.message
    )

  }

}

export function hasSeen(id) {

  return seen.has(
    String(id)
  )

}

export function markSeen(id) {

  seen.add(
    String(id)
  )

  fs.writeFileSync(
    FILE,

    JSON.stringify(
      [...seen],
      null,
      2
    )
  )

}
