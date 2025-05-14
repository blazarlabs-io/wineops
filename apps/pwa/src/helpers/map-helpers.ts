export function getPolygonCenter(coords: { lat: number; lng: number }[]): {
  lat: number;
  lng: number;
} {
  let latSum = 0;
  let lngSum = 0;

  if (coords === undefined || coords === null || coords.length === 0) return { lat: 0, lng: 0 };

  coords.forEach((coord) => {
    latSum += coord.lat;
    lngSum += coord.lng;
  });

  return {
    lat: latSum / coords.length,
    lng: lngSum / coords.length,
  };
}
