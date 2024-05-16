import { PointWithProperties } from "@/app";

export function countNonNullMinDim64Urls(points: PointWithProperties[]) {
  let count = 0;
  for (let obj of points) {
    const url = obj.properties.job?.company?.logoImg?.variants?.min_dim_64_url;
    if (url) {
      count++;
    }
  }
  return count;
}
