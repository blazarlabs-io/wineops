import {
  formatNumber,
  formatNumberWithLowerCaseUnitAndSpace,
} from "@/utils/number-format";
import { QUANTITY_COLORS } from "./constants";
import { capitalize } from "@/utils/string-utils";
import { Metric } from "@/models/types/db";

interface LegendItemProps {
  name: Metric;
  value: number;
  backgroundColor?: string;
  color?: string;
  unit?: string;
}

export default function LegendItem({
  name,
  value,
  backgroundColor,
  color = "#7A7A7A",
  unit,
}: LegendItemProps) {
  return (
    <span className="flex items-center gap-1">
      <span
        style={{
          backgroundColor: backgroundColor || QUANTITY_COLORS[name].color,
        }}
        className="h-1.5 w-1.5 rounded-full"
      />
      {capitalize(name)}{" "}
      <span style={{ color }}>
        {unit
          ? formatNumberWithLowerCaseUnitAndSpace(value, unit, 1)
          : formatNumber(value, 1)}
      </span>
    </span>
  );
}
