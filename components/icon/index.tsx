import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { AppColors, responsiveSize, useDash } from "../../dash.config";

export const Icon = React.memo(function Icon(props: IconProps) {
  const { color, type } = useDash().tokens;
  return (
    <Feather
      {...props}
      size={responsiveSize((props).size * (type.size.base / 16))}
      color={color[props.color]}
    />
  );
});

export interface IconProps {
  color: AppColors;
  name: any;
  size: number;
}
