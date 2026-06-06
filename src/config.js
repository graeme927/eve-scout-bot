import "dotenv/config"

export default {

  webhook: process.env.WEBHOOK_URL,

  interval:
    Number(process.env.SCAN_INTERVAL || 60),

  tracked: [
    "Thera",
    "Turnur"
  ],

  filterRegions:
    process.env.FILTER_REGIONS
      ?.split(",")
      .map(v => v.trim().toLowerCase())
      .filter(Boolean)
      || []

}
