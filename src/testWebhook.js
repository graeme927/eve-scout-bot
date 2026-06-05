import config from "./config.js"
import { send } from "./webhook.js"

async function test() {

const payload = {

username: "EvE Scout",

embeds: [

{
title:
"🌀 TEST — Turnur Connection",

description:
"This is a webhook test message",

fields: [

{
name: "System",
value: "Jita"
},

{
name: "Life",
value: "Stable"
},

{
name: "Mass",
value: "Fresh"
},

{
name: "Type",
value: "K162"
}

],

footer: {
text: "Webhook Test"
},

timestamp:
new Date()

}

]

}

try {

await send(
config.webhook,
payload
)

console.log(
"✅ Test sent"
)

}

catch (err) {

console.error(
"❌ Failed:"
)

console.error(
err.response?.data
|| err.message
)

}

}

test()
