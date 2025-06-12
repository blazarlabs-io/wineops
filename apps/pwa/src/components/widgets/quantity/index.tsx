import { Fragment } from "react";
import StripedBar from "./striped-bar";
import { QUANTITY_COLORS } from "./constants";
import { SortedValueWithColor } from "./types";
import Legend from "./legend";
import Markers from "./markers";
import { GrapeStatus, Metric, VineyardStatus } from "@/models/types/db";
import { EntityStatus } from "@/models/types/dashboard";

type Metrics = Partial<Record<Metric, number>>;

export type QuantityWidgetProps = Metrics & {
  status?: EntityStatus;
  metrics?: Metrics[];
};

export default function QuantityWidget({
  actual = 0,
  supply = 0,
  demand = 0,
  status,
  metrics = [],
}: QuantityWidgetProps) {
  const hasMetrics = Array.isArray(metrics) && metrics.length > 0;
  const metricsObject = hasMetrics
    ? reduceByType(metrics)
    : { actual, supply, demand };

  const actualValue = metricsObject.actual || 0;
  const supplyValue = metricsObject.supply || 0;
  const demandValue = metricsObject.demand || 0;

  const maxValue = Math.max(actualValue, supplyValue, demandValue);

  const isPreHarvest = hasMetrics
    ? false
    : status === GrapeStatus.IN_TRANSIT ||
      status === VineyardStatus.MAINTENANCE ||
      status === VineyardStatus.READY_FOR_HARVEST ||
      status === VineyardStatus.RIPPING ||
      status === VineyardStatus.VEGETATION;

  const isOnHarvest = hasMetrics
    ? false
    : status === GrapeStatus.RECEIVED || status === VineyardStatus.HARVESTING;

  const isPostHarvest =
    hasMetrics || !status
      ? true
      : status === VineyardStatus.HARVEST_ENDED ||
        status === GrapeStatus.PROCESSED ||
        status === GrapeStatus.DEHYDRATED ||
        status === GrapeStatus.FRIDGE_STORED ||
        status === GrapeStatus.STORED;

  const sortedValuesWithColors: SortedValueWithColor[] = Object.entries(
    QUANTITY_COLORS
  )
    .map(([type, colors]) => ({
      ...colors,
      type: type as Metric,
      value:
        type === Metric.ACTUAL
          ? actualValue
          : type === Metric.SUPPLY
            ? supplyValue
            : demandValue,
    }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => a.value - b.value);

  return (
    <div
      className="flex flex-col gap-8 p-3 max-w-[224]"
      style={{ lineHeight: 1 }}
    >
      <div className="relative1 flex flex-col items-center">
        <Legend
          actual={actualValue}
          supply={supplyValue}
          demand={demandValue}
        />

        <div className="w-full h-7.5 flex overflow-hidden rounded-xs">
          {sortedValuesWithColors.length === 0 && (
            <>
              <span className="h-full w-[3px] rounded bg-gray-400" />
              <div className="w-full rounded-r-xs border border-l-0 border-gray-300 my-1" />
            </>
          )}

          {sortedValuesWithColors.map(
            (
              {
                type,
                value,
                color,
                markerColor,
                lightColor,
                darkColor,
                secondaryLightColor,
                secondaryDarkColor,
              },
              index
            ) => {
              const percentage = Math.round(
                ((value - (sortedValuesWithColors[index - 1]?.value || 0)) /
                  maxValue) *
                  100
              );

              const isActual = type === Metric.ACTUAL;
              const isSupply = type === Metric.SUPPLY;
              const isDemand = type === Metric.DEMAND;

              const backgroundColor =
                isPreHarvest ||
                (isSupply &&
                  (!isPostHarvest ||
                    (isPostHarvest && supply > actual && supply > demand))) ||
                (isOnHarvest && isDemand && value < supplyValue) ||
                (isPostHarvest && isActual && supplyValue === 0)
                  ? ""
                  : isPostHarvest && isSupply
                    ? demand > actual && demand > 0 && supply > actual
                      ? darkColor
                      : actual > demand && demand > 0 && supply <= demand
                        ? secondaryDarkColor
                        : lightColor
                    : (isPostHarvest &&
                      demandValue > 0 &&
                      ((demandValue < actualValue && !isActual) ||
                        (demandValue === actualValue && isActual))
                        ? secondaryDarkColor
                        : darkColor) || color;

              const isHigherDemand =
                (isPreHarvest &&
                  isDemand &&
                  value > actualValue + supplyValue) ||
                (isOnHarvest &&
                  (isActual || (isDemand && value > supplyValue)));

              const isLowerDemand = isDemand && value <= actualValue;

              const showStripedBar =
                isHigherDemand || (isLowerDemand && isOnHarvest);

              return (
                <Fragment key={index}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      transition: "width 0.3s ease-in-out",
                    }}
                    className={`border-y border-gray-300 my-1 h-5.5 ${index === 0 ? "ml-0 pl-0.5 rounded-l-xs border-l" : ""}`}
                  >
                    {showStripedBar ? (
                      <StripedBar
                        className={`my-0.5 ${index === 0 ? "rounded-l-xs" : ""}`}
                        lightColor={
                          isLowerDemand ? secondaryLightColor : lightColor
                        }
                        darkColor={
                          isLowerDemand ? secondaryDarkColor : darkColor
                        }
                      />
                    ) : (
                      <div
                        style={{ backgroundColor }}
                        className={`h-4 overflow-hidden my-0.5 ${index === 0 ? "rounded-l-xs" : ""}`}
                      />
                    )}
                  </div>
                  <span
                    className="h-full w-[3px] rounded"
                    style={{
                      backgroundColor:
                        markerColor ||
                        (isLowerDemand ? secondaryDarkColor : color),
                    }}
                  />
                </Fragment>
              );
            }
          )}
        </div>

        <Markers maxValue={maxValue} markers={sortedValuesWithColors} />
      </div>
    </div>
  );
}

const reduceByType = (items: Metrics[]): Metrics =>
  items.reduce(
    (acc, { actual = 0, supply = 0, demand = 0 }) => ({
      actual: (acc.actual || 0) + actual,
      supply: (acc.supply || 0) + supply,
      demand: (acc.demand || 0) + demand,
    }),
    { actual: 0, supply: 0, demand: 0 }
  );
