import { PointWithProperties } from "@/app";
import { countNonNullMinDim64Urls } from "@/utils/map";
import React, { useEffect, useRef, useState } from "react";

export default function useTrackChanges(points: PointWithProperties[]) {
  const renderCount = useRef(0);

  const [shouldTrack, setShouldTrack] = useState(true);
  useEffect(() => {
    const nonNullURI = countNonNullMinDim64Urls(points);
    if (nonNullURI <= renderCount.current) {
      setShouldTrack(false);
    }
  }, [renderCount.current]);

  return {
    shouldTrack,
    renderCount,
  };
}
