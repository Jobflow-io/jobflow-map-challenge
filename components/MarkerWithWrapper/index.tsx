import { MutableRefObject, useRef } from "react";
import type { MapMarker } from "react-native-maps";
import { Marker } from "react-native-maps";
import { Marker as MarkerMap } from "@/components/Marker";

import { PointWithProperties } from "@/app";

type Props = {
  point: PointWithProperties;
  onPointPress: () => void;
  isSelected: boolean;
  zoom: number;

  shouldTrack: boolean;
  renderCount: MutableRefObject<number>;
};

export default function MarkerWithWrapper({
  point,
  onPointPress,
  shouldTrack,
  renderCount,
}: Props) {
  const coordinates = point.geometry.coordinates;
  const markerRef = useRef<MapMarker>(null);

  const lat = coordinates[1];
  const lng = coordinates[0];

  const job = point.properties.job;

  return (
    <Marker
      ref={markerRef}
      tracksViewChanges={shouldTrack}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={() => onPointPress()}
    >
      <MarkerMap
        companyLogo={job.company.logoImg?.variants.min_dim_64_url ?? null}
        renderCount={renderCount}
      />
    </Marker>
  );
}
