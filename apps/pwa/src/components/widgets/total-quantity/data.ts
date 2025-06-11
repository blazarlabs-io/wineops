/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityStatus } from "@/models/types/dashboard";
import { MetricsOutput, MetricsOutput2, MetricsTotal } from "./types";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { TOTAL_QUANTITY_COLORS } from "./constants";
import { useColorScheme } from "@mui/material";

const IS_PRE = (status?: EntityStatus) =>
  status === GrapeStatus.IN_TRANSIT ||
  status === VineyardStatus.MAINTENANCE ||
  status === VineyardStatus.READY_FOR_HARVEST ||
  status === VineyardStatus.RIPPING ||
  status === VineyardStatus.VEGETATION;

const IS_ON = (status?: EntityStatus) =>
  status === GrapeStatus.RECEIVED || status === VineyardStatus.HARVESTING;

const IS_ENDED = (status?: EntityStatus) =>
  status === VineyardStatus.HARVEST_ENDED ||
  status === GrapeStatus.PROCESSED ||
  status === GrapeStatus.DEHYDRATED ||
  status === GrapeStatus.FRIDGE_STORED ||
  status === GrapeStatus.STORED;

export const useChartOptions = (metrics: MetricsTotal[]) => {
  const { mode } = useColorScheme();
  const isDarkMode = mode === "dark";
  const chartTheme = "ag-material";
  const themeClass = isDarkMode ? `${chartTheme}-dark` : chartTheme;

  const normalized = metrics.reduce(
    (acc, { vineyard, status, actual = 0, demand = 0, supply = 0 }) => {
      const metric = {
        status,
        max: Math.max(actual, demand, supply),
        maxu: Math.max(actual, demand, IS_ENDED(status) ? 0 : supply),
        pro: IS_ENDED(status)
          ? actual > 0 && demand > 0 && actual - demand > 0
            ? actual - demand
            : 0
          : 0,
        def: IS_ENDED(status)
          ? actual > 0 && demand > 0 && demand - actual > 0
            ? demand - actual
            : 0
          : 0,
        vineyard,
      };

      const stripedGrey =
        100 *
        (metric.max > 0 && (IS_PRE(status) || IS_ON(status))
          ? (demand > actual && actual > 0
              ? actual
              : actual >= demand && demand >= 0
                ? actual - demand
                : 0) / metric.max
          : 0);

      const stripedGreen =
        100 *
        (metric.max > 0 && (IS_PRE(status) || IS_ON(status))
          ? actual >= demand && demand >= 0
            ? demand / metric.max
            : 0
          : 0);

      const stripedRed =
        100 *
        (metric.max > 0 && (IS_PRE(status) || IS_ON(status))
          ? (demand > supply && supply > actual
              ? demand - supply
              : demand > actual && actual > supply
                ? demand - actual
                : 0) / metric.max
          : 0);

      const grey =
        100 *
        (metric.max > 0 && IS_ENDED(status)
          ? (actual >= demand && demand >= 0
              ? actual - demand
              : demand >= actual && actual >= 0
                ? actual
                : 0) / metric.max
          : 0);

      const green =
        100 *
        (metric.max > 0 && IS_ENDED(status)
          ? (actual > demand ? demand : 0) / metric.max
          : 0);

      const red =
        100 *
        (metric.max > 0 && IS_ENDED(status)
          ? (demand > actual ? demand - actual : 0) / metric.max
          : 0);

      const white =
        100 -
        (metric.max > 0 && IS_ENDED(status)
          ? grey + green + red
          : stripedGrey + stripedGreen + stripedRed);

      return [
        ...acc,
        {
          stripedGrey: parseFloat(stripedGrey.toFixed(4)),
          stripedGreen: parseFloat(stripedGreen.toFixed(4)),
          stripedRed: parseFloat(stripedRed.toFixed(4)),
          white: parseFloat(white.toFixed(4)),
          grey: parseFloat(grey.toFixed(4)),
          green: parseFloat(green.toFixed(4)),
          red: parseFloat(red.toFixed(4)),
          ...metric,
        },
      ];
    },
    [] as MetricsOutput[]
  );

  const totu = normalized.reduce((sum, { maxu = 0 }) => (sum += maxu), 0);

  const normalized2 = normalized.reduce(
    (
      acc,
      {
        status,
        maxu = 0,
        green = 0,
        grey = 0,
        red = 0,
        white = 0,
        stripedGreen = 0,
        stripedRed = 0,
        stripedGrey = 0,
      }
    ) => {
      const barPercent = parseFloat(
        ((100 * (maxu || 0)) / (totu || 0)).toFixed(4)
      );

      const colorsPercent =
        green + grey + red + (!IS_ENDED(status) ? white : 0);

      const greenPercent =
        colorsPercent > 0
          ? parseFloat(((green * barPercent) / colorsPercent).toFixed(4))
          : 0;
      const redPercent =
        colorsPercent > 0
          ? parseFloat(((red * barPercent) / colorsPercent).toFixed(4))
          : 0;
      const greyPercent =
        colorsPercent > 0
          ? parseFloat(((grey * barPercent) / colorsPercent).toFixed(4))
          : 0;

      const stripedGreenPercent = parseFloat(
        ((stripedGreen * barPercent) / 100).toFixed(4)
      );
      const stripedRedPercent = parseFloat(
        ((stripedRed * barPercent) / 100).toFixed(4)
      );
      const stripedGreyPercent = parseFloat(
        ((stripedGrey * barPercent) / 100).toFixed(4)
      );
      const whitePercent = parseFloat(
        (((!IS_ENDED(status) ? white : 0) * barPercent) / 100).toFixed(4)
      );

      return [
        ...acc,
        {
          colorsPercent,
          greenPercent,
          redPercent,
          greyPercent,
          barPercent,
          stripedGreenPercent,
          stripedRedPercent,
          stripedGreyPercent,
          whitePercent,
        },
      ];
    },
    [] as MetricsOutput2[]
  );

  const normalized3 = normalized2.reduce(
    (
      acc,
      {
        greenPercent = 0,
        redPercent = 0,
        greyPercent = 0,
        stripedGreenPercent = 0,
        stripedRedPercent = 0,
        stripedGreyPercent = 0,
        whitePercent = 0,
        barPercent = 0,
      }
    ) => {
      return {
        barPercent,
        greenPercent: parseFloat(
          ((acc?.greenPercent || 0) + greenPercent).toFixed(4)
        ),
        redPercent: parseFloat(
          ((acc?.redPercent || 0) + redPercent).toFixed(4)
        ),
        greyPercent: parseFloat(
          ((acc?.greyPercent || 0) + greyPercent).toFixed(4)
        ),
        stripedGreenPercent: parseFloat(
          ((acc?.stripedGreenPercent || 0) + stripedGreenPercent).toFixed(4)
        ),
        stripedRedPercent: parseFloat(
          ((acc?.stripedRedPercent || 0) + stripedRedPercent).toFixed(4)
        ),
        stripedGreyPercent: parseFloat(
          ((acc?.stripedGreyPercent || 0) + stripedGreyPercent).toFixed(4)
        ),
        whitePercent: parseFloat(
          ((acc?.whitePercent || 0) + whitePercent).toFixed(4)
        ),
      };
    },
    {} as MetricsOutput2
  );

  const {
    greenPercent,
    redPercent,
    greyPercent,
    stripedGreenPercent,
    stripedRedPercent,
    stripedGreyPercent,
    whitePercent,
  } = normalized3;

  const dataset = [
    {
      ...(stripedGreyPercent > 0 && {
        stripedGrey: stripedGreyPercent,
      }),

      ...(greyPercent > 0 && {
        grey: greyPercent,
      }),

      ...(stripedGreenPercent > 0 && {
        stripedGreen: stripedGreenPercent,
      }),

      ...(greenPercent > 0 && {
        green: greenPercent,
      }),

      ...(stripedRedPercent > 0 && {
        stripedRed: stripedRedPercent,
      }),

      ...(redPercent > 0 && {
        red: redPercent,
      }),

      ...(whitePercent > 0 && {
        white: whitePercent,
      }),
      total: "",
    },
  ];

  function valueFormatter(value: number | null) {
    return `${(value || 0).toFixed(2)}% ≈ ${(((value || 0) * totu) / 100).toFixed(0)} T`;
  }

  const series = [
    stripedGreyPercent > 0
      ? {
          dataKey: "stripedGrey",
          label: "Grey.s",
          color: `url(#StripedPattern-grey)`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    greyPercent > 0
      ? {
          dataKey: "grey",
          label: "Grey",
          color: `${TOTAL_QUANTITY_COLORS.grey.darkColor}`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    stripedGreenPercent > 0
      ? {
          dataKey: "stripedGreen",
          label: "Green.s",
          color: `url(#StripedPattern-green)`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    greenPercent > 0
      ? {
          dataKey: "green",
          label: "Green",
          color: `${TOTAL_QUANTITY_COLORS.green.darkColor}`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    stripedRedPercent > 0
      ? {
          dataKey: "stripedRed",
          label: "Red.s",
          color: `url(#StripedPattern-red)`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    redPercent > 0
      ? {
          dataKey: "red",
          label: "Red",
          color: `${TOTAL_QUANTITY_COLORS.red.darkColor}`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
    whitePercent > 0
      ? {
          dataKey: "white",
          label: "White",
          color: `${TOTAL_QUANTITY_COLORS.white.darkColor}`,
          stack: "total",
          valueFormatter,
        }
      : undefined,
  ].filter((s) => s !== undefined);

  return {
    muiDataset: dataset,
    muiSeries: series,
    agChartOptions: {
      data: dataset,
      series: series.map((s) => {
        const isStriped = s.dataKey.includes("striped");
        const key = s.dataKey.replace("striped", "").toLowerCase();
        const colors =
          TOTAL_QUANTITY_COLORS[key] ?? TOTAL_QUANTITY_COLORS["default"];

        return {
          type: "bar",
          direction: "horizontal",
          xKey: "total",
          stacked: true,
          yKey: s.dataKey,
          yName: s.label,
          ...(key === "white" && { stroke: "#d1d5dc", strokeWidth: 1 }),
          fill: isStriped
            ? {
                type: "pattern",
                pattern: "forward-slanted-lines",
                scale: 2,
                backgroundFill: colors.lightColor,
                backgroundFillOpacity: 1,
                stroke: colors.darkColor,
                strokeOpacity: 1,
              }
            : s.color || colors.color || colors.darkColor || colors.lightColor,
        };
      }),
      autoSize: true,
      minHeight: 140,
      height: 150,
      minWidth: 230,
      legend: {
        position: "top",
        spacing: 20,
        maxWidth: 1000,
        maxHeight: 100,
        pagination: {
          enabled: false,
        },
      },
      theme: {
        baseTheme: themeClass,
        params: {
          fontFamily: "Lato, sans-serif",
          backgroundColor: "transparent",
          foregroundColor: isDarkMode ? "#FFFFFFCC" : "#361008CC",
        },
      },
      axes: [
        {
          type: "category",
          position: "left",
          line: { enabled: false },
          labels: { enabled: false },
        },
        {
          type: "number",
          position: "bottom",
          label: {
            formatter: (params: any) => `${params.value.toFixed(0)}%`,
          },
          thickness: 50,
        },
      ],
      /*overlays: {
      noData: {
        text: "",
      },
    },*/
    },
  };
};
