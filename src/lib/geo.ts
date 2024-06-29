// use great circle distance formula to see if a given set of lat, lng
// falls within 2 km radius of a given lat, lng
// return true if it does, false otherwise

export function isWithin2Km(
  reportCoords: { latitude: number; longitude: number },
  userCoords: { latitude: number; longitude: number }
): boolean {
  const R = 6371; // Radius of the earth in km
  const { latitude: lat1, longitude: lon1 } = reportCoords;
  const { latitude: lat2, longitude: lon2 } = userCoords;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d <= 2;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
