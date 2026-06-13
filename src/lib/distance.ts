export type TravelMode = "walk" | "drive"

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(Math.min(1, a)), Math.sqrt(1 - Math.min(1, a)))
}

export function walkMinutes(km: number): number {
  return Math.max(1, Math.round((km / 4) * 60))
}

export function driveMinutes(km: number): number {
  return Math.max(1, Math.round((km / 30) * 60))
}

export function travelMinutes(km: number, mode: TravelMode): number {
  return mode === "walk" ? walkMinutes(km) : driveMinutes(km)
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `약 ${Math.round((km * 1000) / 10) * 10}m`
  }
  return `약 ${km.toFixed(1)}km`
}
