const cache = new Map()

export async function getRegion(systemId) {
  if (!systemId) return "Unknown"

  if (cache.has(systemId)) {
    return cache.get(systemId)
  }

  try {
    const sys = await fetch(
      `https://esi.evetech.net/latest/universe/systems/${systemId}/`
    ).then(r => r.json())

    if (!sys?.region_id) return "Unknown"

    const region = await fetch(
      `https://esi.evetech.net/latest/universe/regions/${sys.region_id}/`
    ).then(r => r.json())

    const name = region?.name || "Unknown"

    cache.set(systemId, name)

    return name
  } catch {
    return "Unknown"
  }
}
