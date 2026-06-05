import fs from "fs"

const FILE =
"./data/seen.json"

export function loadSeen(){

try{

return new Set(
JSON.parse(
fs.readFileSync(FILE)
)
)

}

catch{

return new Set()

}

}

export function saveSeen(set){

fs.mkdirSync(
"./data",
{
recursive:true
}
)

fs.writeFileSync(

FILE,

JSON.stringify(
[...set]
)

)

}
