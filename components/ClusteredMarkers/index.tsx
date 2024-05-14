import { PointProperties, PointWithProperties } from "@/app";
import React from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { Marker } from "react-native-maps";
import MarkerWithWrapper from "../MarkerWithWrapper";
import Supercluster, { PointFeature } from "supercluster";

type Props = {
  clusters: (
    | PointFeature<
        {
          [name: string]: any;
        } & PointProperties
      >
    | PointFeature<Supercluster.ClusterProperties & Supercluster.AnyProps>
  )[];
  zoom: number;
};

export default function ClusteredMarkers({
  clusters,

  zoom,
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
            <Text style={styles.clusterCount}>{properties.point_count}</Text>
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
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "blue",
    backgroundColor: "white",
    width: 30,
    height: 30,
  },
  clusterCount: {
    fontSize: 16,
    color: "blue",
  },
});
