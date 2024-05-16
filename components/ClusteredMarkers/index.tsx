import { PointProperties, PointWithProperties } from "@/app";
import React from "react";
import { Alert, StyleSheet, View, Image } from "react-native";
import { Marker } from "react-native-maps";
import MarkerWithWrapper from "../MarkerWithWrapper";
import Supercluster, { PointFeature } from "supercluster";
import { getFirstNonNullMinDim64Url } from "@/utils";
type Props = {
  clusters: (
    | PointFeature<
        {
          [name: string]: any;
        } & PointProperties
      >
    | PointFeature<Supercluster.ClusterProperties & Supercluster.AnyProps>
  )[];
  supercluster:
    | Supercluster<
        {
          [name: string]: any;
        } & PointProperties,
        Supercluster.AnyProps
      >
    | undefined;
  zoom: number;
};

export default function ClusteredMarkers({
  clusters,
  zoom,
  supercluster,
}: Props) {
  function onPointPress() {
    Alert.alert(`Clicked on point!`);
  }
  return clusters?.map((point) => {
    const [longitude, latitude] = point.geometry.coordinates;
    const coordinates = { latitude, longitude };
    const properties = point.properties;

    if (properties?.cluster) {
      return (
        <Marker key={properties.cluster_id} coordinate={coordinates}>
          <View style={styles.cluster}>
            <Image
              style={styles.logo}
              resizeMode="contain"
              source={getFirstNonNullMinDim64Url(
                supercluster?.getLeaves(point.properties.cluster_id)
              )}
            />
          </View>
        </Marker>
      );
    }

    return (
      <MarkerWithWrapper
        key={point.properties.searchJobAd.combinedId}
        isSelected={false}
        onPointPress={onPointPress}
        point={point as PointWithProperties}
        zoom={zoom}
      />
    );
  });
}

const styles = StyleSheet.create({
  cluster: {
    width: 40,
    height: 40,
    padding: 3,
    margin: 3,
    borderRadius: 50,
    backgroundColor: "white",
    overflow: "hidden",
    zIndex: 3,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 30,
  },
});
