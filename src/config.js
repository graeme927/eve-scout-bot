import dotenv from "dotenv"

dotenv.config()

export default {

webhook:
process.env.WEBHOOK_URL,

poll:
Number(
process.env.POLL_SECONDS
),

tracked:[
"Thera",
"Turnur"
]

}
