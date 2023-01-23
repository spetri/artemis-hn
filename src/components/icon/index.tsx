import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { useDash, responsiveSize, AppColors } from "../../../dash.config";

export const Icon = memo(function Icon(props: IconProps) {
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
