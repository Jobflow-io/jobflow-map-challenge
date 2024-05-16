import React, { Dispatch, MutableRefObject } from "react";
import { Image, Platform, View } from "react-native";

import { MapMarker } from "react-native-maps";
import styles from "./styles";

interface Props {
  companyLogo: string | null;
  renderCount: MutableRefObject<number>;
}

export const Marker = ({ companyLogo, renderCount }: Props) => {
  const onLoadEnd = () => {
    renderCount.current++;
  };

  const onError = () => {
    renderCount.current++;
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
          onError={onError}
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
