import axios from "axios"

export async function send(
url,
payload
){

await axios.post(
url,
payload
)

}
