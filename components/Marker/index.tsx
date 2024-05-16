import React, { Dispatch } from "react";
import { Image, Platform, View } from "react-native";

import { MapMarker } from "react-native-maps";
import styles from "./styles";

interface Props {
  companyLogo: string | null;
  update: Dispatch<React.SetStateAction<boolean>>;
  markerRef: React.RefObject<MapMarker>;
}

export const Marker = ({ companyLogo, markerRef, update }: Props) => {
  const onLoadEnd = () => {
    if (Platform.OS === "android") {
      markerRef.current?.redraw();
    } else {
      update(false);
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          overflow: "hidden",
          zIndex: 3,
        },
      ]}
    >
      {companyLogo ? (
        <Image
          style={[styles.logo]}
          resizeMode="contain"
          source={{ uri: companyLogo }}
          onLoadEnd={onLoadEnd}
          fadeDuration={0}
        />
      ) : (
        <Image
          style={[styles.logo]}
          source={require("@/assets/images/company-placeholder-128.jpg")}
        ></Image>
      )}
    </View>
  );
};
