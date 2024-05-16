import React, { useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import type { Region } from "react-native-maps";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import type { BBox, GeoJsonProperties } from "geojson";
import type { PointFeature } from "supercluster";
import useSupercluster from "use-supercluster";
import MarkerWithWrapper from "@/components/MarkerWithWrapper";
import jobs from "@/constants/jobs.json";
import { SearchJobAdRo } from "@/models";
import useTrackChanges from "@/hooks/useTrackChanges";

export interface PointProperties {
  cluster: boolean;
  color: string;
  job: any;
  searchJobAd: SearchJobAdRo;
}

export type PointWithProperties = PointFeature<
  GeoJsonProperties & PointProperties
>;

const DEFAULT_MAP_LOCATION = {
  lat: 52.5067296,
  lng: 13.2599281,
};

const calculateDeltas = (latitude: number, radius: number) => {
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

const Map = () => {
  const mapRef = useRef<MapView>(null);

  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState<number>(12);

  const latitude = DEFAULT_MAP_LOCATION.lat;

  const { latDelta, lonDelta } = calculateDeltas(latitude, 75);

  // TODO: This shouldn't need to be sliced!
  const searchResultJobAds = jobs.searchJobAds.slice(0, 300);

  const regionToBoundingBox = (region: Region): BBox => {
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

  const onRegionChangeComplete = async (region: Region) => {
    const mapBoundsFirst = regionToBoundingBox(region);

    const originalWidth = mapBoundsFirst[2] - mapBoundsFirst[0];
    const originalHeight = mapBoundsFirst[3] - mapBoundsFirst[1];

    const mapBounds = [
      mapBoundsFirst[0] + originalWidth / 4,
      mapBoundsFirst[1] + originalHeight / 4,
      mapBoundsFirst[2] - originalWidth / 4,
      mapBoundsFirst[3] - originalHeight / 4,
    ] as any;

    setBounds(mapBounds);

    const camera = await mapRef.current?.getCamera();

    setZoom(camera?.zoom ?? 10);
  };

  const points = searchResultJobAds.map((searchJobAd) => {
    const loc = searchJobAd.primaryLocation;

    return {
      type: "Feature",
      properties: {
        job: searchJobAd.jobAd,
        cluster: false,
        color: "blue",
        searchJobAd,
      },
      geometry: {
        type: "Point",
        coordinates: [loc.location.lng, loc.location.lat],
      },
    } as PointWithProperties;
  });

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 60,
      maxZoom: 25,
    },
  });

  const { renderCount, shouldTrack } = useTrackChanges(points);
  function onPointPress() {
    Alert.alert(`Clicked on point!`);
  }

  const renderMarkers = () => {
    console.log(`points: ${points.length}`);
    return points.map((point) => {
      return (
        <MarkerWithWrapper
          key={point.properties.searchJobAd.combinedId}
          isSelected={false}
          onPointPress={onPointPress}
          point={point}
          zoom={zoom}
          shouldTrack={shouldTrack}
          renderCount={renderCount}
        ></MarkerWithWrapper>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={onRegionChangeComplete}
          initialRegion={{
            latitude: DEFAULT_MAP_LOCATION.lat,
            longitude: DEFAULT_MAP_LOCATION.lng,
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta,
          }}
          camera={{
            center: {
              latitude: DEFAULT_MAP_LOCATION.lat,
              longitude: DEFAULT_MAP_LOCATION.lng,
            },
            pitch: 0,
            heading: 0,
            zoom: 10,
          }}
          rotateEnabled={false}
          zoomEnabled={true}
          pitchEnabled={false}
          zoomControlEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <Circle
            center={{
              latitude: DEFAULT_MAP_LOCATION.lat,
              longitude: DEFAULT_MAP_LOCATION.lng,
            }}
            radius={1000 * 50}
            strokeWidth={2}
            strokeColor="blue"
          />

          {renderMarkers()}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  cluster: {
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "blue",
    backgroundColor: "white",
  },
  clusterCount: {
    fontSize: 16,
    color: "blue",
  },
  loaderWrapper: {
    borderRadius: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    position: "absolute",
    top: 80,
  },
});

export default Map;
