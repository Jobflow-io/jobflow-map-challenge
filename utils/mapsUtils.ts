import type { Region } from "react-native-maps";
import type { BBox } from "geojson";

export const calculateDeltas = (latitude: number, radius: number) => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  // This basically adds empty space around the radius circle
  // For some reason adding the radius twice works perfectly
  const additionalCoverage = radius;
  // Convert distance to radians
  const distanceRadians = (radius + additionalCoverage) / earthRadius;

  // Calculate latitude delta (1 degree = 111.32 km)
  const latDelta = distanceRadians * (180 / Math.PI);

  // Calculate longitude delta based on latitude
  const lonDelta = latDelta / Math.cos((latitude * Math.PI) / 180);

  return {
    latDelta,
    lonDelta,
  };
};

export const regionToBoundingBox = (region: Region): BBox => {
  let lngD: number;
  if (region.longitudeDelta < 0) lngD = region.longitudeDelta + 360;
  else lngD = region.longitudeDelta;

  return [
    region.longitude - lngD,
    region.latitude - region.latitudeDelta,
    region.longitude + lngD,
    region.latitude + region.latitudeDelta,
  ];
};
