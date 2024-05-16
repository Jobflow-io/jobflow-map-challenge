import { useRef, useState } from "react";
import type { MapMarker } from "react-native-maps";
import { Marker } from "react-native-maps";
import { Marker as MarkerMap } from "@/components/Marker";

import { PointWithProperties } from "@/app";
import { Platform } from "react-native";

type Props = {
  point: PointWithProperties;
  onPointPress: () => void;
  isSelected: boolean;
  zoom: number;
};

export default function MarkerWithWrapper({
  point,
  onPointPress,
  zoom,
  isSelected,
}: Props) {
  const [shouldTrack, setShouldTrack] = useState(true);
  const coordinates = point.geometry.coordinates;
  const markerRef = useRef<MapMarker>(null);

  const lat = coordinates[1];
  const lng = coordinates[0];

  const job = point.properties.job;

  return (
    <Marker
      ref={markerRef}
      tracksViewChanges={Platform.OS === "android" ? false : shouldTrack}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={() => onPointPress()}
    >
      <MarkerMap
        update={setShouldTrack}
        markerRef={markerRef}
        companyLogo={job.company.logoImg?.variants.min_dim_64_url ?? null}
      />
    </Marker>
  );
}
