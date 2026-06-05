import axios from "axios"

export async function getConnections() {
const res = await axios.get(
"https://api.eve-scout.com/v2/public/signatures"
)
return res.data
}
