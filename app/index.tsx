import ClusteredMarkers from "@/components/ClusteredMarkers";
import jobs from "@/constants/jobs.json";
import { SearchJobAdRo } from "@/models";
import { calculateDeltas, regionToBoundingBox } from "@/utils";
import type { BBox, GeoJsonProperties } from "geojson";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Region } from "react-native-maps";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import type { PointFeature } from "supercluster";
import useSupercluster from "use-supercluster";

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

const Map = () => {
  const mapRef = useRef<MapView>(null);

  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState<number>(12);

  const latitude = DEFAULT_MAP_LOCATION.lat;

  const { latDelta, lonDelta } = calculateDeltas(latitude, 75);

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

  const points = jobs.searchJobAds.map((searchJobAd) => {
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

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 60,
      maxZoom: 25,
    },
  });

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

          <ClusteredMarkers clusters={clusters} zoom={zoom} />
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
