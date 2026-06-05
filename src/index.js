import cron
from "node-cron"

import config
from "./config.js"

import {
scan
}
from "./scanner.js"

console.log(
"Watching wormholes..."
)

scan()

cron.schedule(

`*/${config.poll} * * * * *`,

async ()=>{

try{

await scan()

}

catch(e){

console.log(
e.message
)

}

}

)
