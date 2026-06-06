import config from "./config.js"
import { scan } from "./scanner.js"

console.log(
  `Watching wormholes every ${config.interval}s`
)

await scan()

setInterval(

  scan,

  config.interval *
  1000

)
