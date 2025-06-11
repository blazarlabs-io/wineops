import { formatNumberWithUnit } from "@/utils/number-format";
import { SortedValueWithColor } from "./types";
import { Metric } from "@/models/types/db";

interface MarkersProps {
  maxValue: number;
  markers: SortedValueWithColor[];
}

export default function Markers({ maxValue, markers }: MarkersProps) {
  const actual = markers.find(({ type }) => type === Metric.ACTUAL)?.value || 0;

  return (
    <div className="w-full absolute flex -right-2 py-1 text-[10px]">
      {markers.map(
        ({ type, value, color, textColor, secondaryDarkColor }, index) => {
          const percentage = Math.round(
            ((value - (markers[index - 1]?.value || 0)) / maxValue) * 100
          );

          const isLowerDemand = type === Metric.DEMAND && value <= actual;

          return (
            <div
              key={index}
              className="text-right"
              style={{
                width: `${percentage}%`,
                transition: "width 0.3s ease-in-out",
                color:
                  textColor || (isLowerDemand ? secondaryDarkColor : color),
              }}
            >
              {formatNumberWithUnit(value, "T")}
            </div>
          );
        }
      )}
    </div>
  );
}
