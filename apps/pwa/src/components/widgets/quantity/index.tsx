import { Fragment } from "react";
import StripedBar from "./striped-bar";
import { QUANTITY_COLORS } from "./constants";
import { SortedValueWithColor } from "./types";
import Legend from "./legend";
import Markers from "./markers";
import { GrapeStatus, Metric, VineyardStatus } from "@/models/types/db";
import { EntityStatus } from "@/models/types/dashboard";
import Tooltip from "@mui/material/Tooltip";
import LegendItem from "./legend-item";

type Metrics = Partial<Record<Metric, number>>;

type QuantityWidgetProps = Metrics & {
  status?: EntityStatus;
  unit?: string;
};

export default function QuantityWidget({
  actual = 0,
  supply = 0,
  demand = 0,
  status,
  unit = "kg",
}: QuantityWidgetProps) {
  const actualValue = unit === "kg" ? actual / 1000 : actual;
  const supplyValue = unit === "kg" ? supply / 1000 : supply;
  const demandValue = unit === "kg" ? demand / 1000 : demand;
  const maxValue = Math.max(actualValue, supplyValue, demandValue);

  const isPreHarvest =
    status === GrapeStatus.IN_TRANSIT ||
    status === VineyardStatus.MAINTENANCE ||
    status === VineyardStatus.READY_FOR_HARVEST ||
    status === VineyardStatus.RIPPING ||
    status === VineyardStatus.VEGETATION;

  const isOnHarvest =
    status === GrapeStatus.RECEIVED || status === VineyardStatus.HARVESTING;

  const isPostHarvest = !status
    ? true
    : status === VineyardStatus.HARVEST_ENDED ||
      status === GrapeStatus.PROCESSED ||
      status === GrapeStatus.DEHYDRATED ||
      status === GrapeStatus.FRIDGE_STORED ||
      status === GrapeStatus.STORED;

  const sortedValuesWithColors: SortedValueWithColor[] = Object.entries(
    QUANTITY_COLORS,
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
              index,
            ) => {
              const percentage = Math.round(
                ((value - (sortedValuesWithColors[index - 1]?.value || 0)) /
                  maxValue) *
                  100,
              );

              const isActual = type === Metric.ACTUAL;
              const isSupply = type === Metric.SUPPLY;
              const isDemand = type === Metric.DEMAND;

              const backgroundColor =
                isPreHarvest ||
                (isSupply &&
                  (!isPostHarvest ||
                    (isPostHarvest &&
                      supplyValue > actualValue &&
                      supplyValue > demandValue))) ||
                (isOnHarvest && isDemand && value < supplyValue) ||
                (isPostHarvest && isActual && supplyValue === 0.1010101010101)
                  ? ""
                  : isPostHarvest && isSupply
                    ? demandValue > actualValue &&
                      demandValue > 0 &&
                      supplyValue > actualValue
                      ? darkColor
                      : actualValue > demandValue &&
                          demandValue > 0 &&
                          supplyValue <= demandValue
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
                  <Tooltip
                    title={
                      <>
                        <LegendItem
                          name={type}
                          value={
                            isActual
                              ? actual
                              : isDemand
                                ? demand
                                : isSupply
                                  ? supply
                                  : 0
                          }
                          {...(isDemand &&
                            demand > 0 &&
                            demand <= actual && {
                              backgroundColor:
                                QUANTITY_COLORS.demand.secondaryDarkColor,
                            })}
                          color="#DBDBDB"
                          unit={unit}
                        />
                        {sortedValuesWithColors
                          .filter(
                            (item) =>
                              item.type !== type && item.value === value,
                          )
                          .map(({ type }) => (
                            <LegendItem
                              key={type}
                              name={type}
                              value={
                                isActual
                                  ? actual
                                  : isDemand
                                    ? demand
                                    : isSupply
                                      ? supply
                                      : 0
                              }
                              {...(type === Metric.DEMAND &&
                                demand > 0 &&
                                demand <= actual && {
                                  backgroundColor:
                                    QUANTITY_COLORS.demand.secondaryDarkColor,
                                })}
                              color="#DBDBDB"
                              unit={unit}
                            />
                          ))}
                      </>
                    }
                  >
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
                  </Tooltip>
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
            },
          )}
        </div>

        <Markers maxValue={maxValue} markers={sortedValuesWithColors} />
      </div>
    </div>
  );
}
