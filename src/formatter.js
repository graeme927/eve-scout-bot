import { getHubColor } from "./colors.js"

export function makeEmbed(data) {

return {

username: "EvE Scout",

embeds: [

{

title: `🌀 ${data.hub} Connection`,

color: getHubColor(data.hub),

fields: [

{
name: "System",
value: data.system,
inline: true
},

{
name: "Life",
value: data.life ?? "Unknown",
inline: true
},

{
name: "Mass",
value: data.mass ?? "Unknown",
inline: true
}

],

footer: {
text: `EvE Scout Intel • ${data.hub}`
},

timestamp: new Date()

}

]

}

}
