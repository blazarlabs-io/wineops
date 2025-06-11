import { Metric } from "@/models/types/db";
import { QUANTITY_COLORS } from "./constants";
import LegendItem from "./legend-item";

export default function Legend({
  actual,
  supply,
  demand,
}: Record<Metric, number>) {
  return (
    <div className="flex gap-2 py-1 text-xs justify-between">
      <LegendItem name={Metric.ACTUAL} value={actual} />
      <LegendItem name={Metric.SUPPLY} value={supply} />
      <LegendItem
        name={Metric.DEMAND}
        value={demand}
        {...(demand > 0 &&
          demand <= actual && {
            backgroundColor: QUANTITY_COLORS.demand.secondaryDarkColor,
          })}
      />
    </div>
  );
}
