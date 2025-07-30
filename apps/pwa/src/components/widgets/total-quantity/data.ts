import { EntityStatus } from "@/models/types/dashboard";
import { MetricsOutput, MetricsOutput2, MetricsTotal } from "./types";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { TOTAL_QUANTITY_COLORS } from "./constants";
import { useColorScheme } from "@mui/material";
import {
  formatNumberWithLowerCaseUnitAndSpace,
  formatNumberWithUnit,
} from "@/utils/number-format";

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
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const chartTheme = "ag-material";
  const themeClass = isDarkMode ? `${chartTheme}-dark` : chartTheme;

  const normalized = metrics.reduce((acc, metricRaw = {}) => {
    const { vineyard, status, unit = "kg" } = metricRaw;

    const actual =
      unit === "kg" ? (metricRaw?.actual || 0) / 1000 : metricRaw?.actual || 0;
    const supply =
      unit === "kg" ? (metricRaw?.supply || 0) / 1000 : metricRaw?.supply || 0;
    const demand =
      unit === "kg" ? (metricRaw?.demand || 0) / 1000 : metricRaw?.demand || 0;

    const metric = {
      status,
      max: Math.max(actual, demand, supply),
      maxu: Math.max(actual, demand, IS_ENDED(status) ? 0 : supply),

      sur: IS_ENDED(status)
        ? actual > 0 && demand > 0 && actual - demand > 0
          ? actual - demand
          : 0
        : 0,
      def: IS_ENDED(status)
        ? actual > 0 && demand > 0 && demand - actual > 0
          ? demand - actual
          : 0
        : 0,
      ar: !IS_ENDED(status)
        ? supply > actual
          ? demand - supply
          : demand - actual
        : 0,
      co: actual > demand && actual > 0 ? demand : 0,
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
        stripedGrey: Number.parseFloat(stripedGrey.toFixed(4)),
        stripedGreen: Number.parseFloat(stripedGreen.toFixed(4)),
        stripedRed: Number.parseFloat(stripedRed.toFixed(4)),
        white: Number.parseFloat(white.toFixed(4)),
        grey: Number.parseFloat(grey.toFixed(4)),
        green: Number.parseFloat(green.toFixed(4)),
        red: Number.parseFloat(red.toFixed(4)),
        ...metric,
      },
    ];
  }, [] as MetricsOutput[]);

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
        sur = 0,
        def = 0,
        ar = 0,
        co = 0,
      },
    ) => {
      const barPercent =
        (totu || 0) > 0
          ? Number.parseFloat(((100 * (maxu || 0)) / (totu || 0)).toFixed(4))
          : 0;

      const colorsPercent =
        green + grey + red + (!IS_ENDED(status) ? white : 0);

      const greenPercent =
        colorsPercent > 0
          ? Number.parseFloat(((green * barPercent) / colorsPercent).toFixed(4))
          : 0;
      const redPercent =
        colorsPercent > 0
          ? Number.parseFloat(((red * barPercent) / colorsPercent).toFixed(4))
          : 0;
      const greyPercent =
        colorsPercent > 0
          ? Number.parseFloat(((grey * barPercent) / colorsPercent).toFixed(4))
          : 0;

      const stripedGreenPercent = Number.parseFloat(
        ((stripedGreen * barPercent) / 100).toFixed(4),
      );
      const stripedRedPercent = Number.parseFloat(
        ((stripedRed * barPercent) / 100).toFixed(4),
      );
      const stripedGreyPercent = Number.parseFloat(
        ((stripedGrey * barPercent) / 100).toFixed(4),
      );
      const whitePercent = Number.parseFloat(
        (((!IS_ENDED(status) ? white : 0) * barPercent) / 100).toFixed(4),
      );

      return [
        ...acc,
        {
          colorsPercent: isNaN(colorsPercent) ? 0 : colorsPercent,
          greenPercent: isNaN(greenPercent) ? 0 : greenPercent,
          redPercent: isNaN(redPercent) ? 0 : redPercent,
          greyPercent: isNaN(greyPercent) ? 0 : greyPercent,
          barPercent: isNaN(barPercent) ? 0 : barPercent,
          stripedGreenPercent: isNaN(stripedGreenPercent)
            ? 0
            : stripedGreenPercent,
          stripedRedPercent: isNaN(stripedRedPercent) ? 0 : stripedRedPercent,
          stripedGreyPercent: isNaN(stripedGreyPercent)
            ? 0
            : stripedGreyPercent,
          whitePercent: isNaN(whitePercent) ? 0 : whitePercent,
          sur: isNaN(sur) ? 0 : sur,
          def: isNaN(def) ? 0 : def,
          ar: isNaN(ar) ? 0 : ar,
          co: isNaN(co) ? 0 : co,
        },
      ];
    },
    [] as MetricsOutput2[],
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
        sur = 0,
        def = 0,
        ar = 0,
        co = 0,
      },
    ) => {
      return {
        barPercent,
        greenPercent: Number.parseFloat(
          ((acc?.greenPercent || 0) + greenPercent).toFixed(4),
        ),
        redPercent: Number.parseFloat(
          ((acc?.redPercent || 0) + redPercent).toFixed(4),
        ),
        greyPercent: Number.parseFloat(
          ((acc?.greyPercent || 0) + greyPercent).toFixed(4),
        ),
        stripedGreenPercent: Number.parseFloat(
          ((acc?.stripedGreenPercent || 0) + stripedGreenPercent).toFixed(4),
        ),
        stripedRedPercent: Number.parseFloat(
          ((acc?.stripedRedPercent || 0) + stripedRedPercent).toFixed(4),
        ),
        stripedGreyPercent: Number.parseFloat(
          ((acc?.stripedGreyPercent || 0) + stripedGreyPercent).toFixed(4),
        ),
        whitePercent: Number.parseFloat(
          ((acc?.whitePercent || 0) + whitePercent).toFixed(4),
        ),

        sur: (acc?.sur || 0) + sur,
        def: (acc?.def || 0) + def,
        ar: (acc?.ar || 0) + (ar > 0 ? ar : 0),
        co: (acc?.co || 0) + co,
        totu,
      };
    },
    {} as MetricsOutput2,
  );

  const {
    greenPercent,
    redPercent,
    greyPercent,
    stripedGreenPercent,
    stripedRedPercent,
    stripedGreyPercent,
    whitePercent,
    sur,
    def,
    ar,
    co,
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
      totu,
    },
  ];

  function valueFormatter(value: number | null) {
    return `${formatNumberWithUnit(value || 0, "%", 2)} = ${formatNumberWithLowerCaseUnitAndSpace(((value || 0) * totu) / 100, "T", 2)}`;
  }

  const series = [
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
          color: `${TOTAL_QUANTITY_COLORS.grey.lightColor}`,
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
    relatedData: {
      sur,
      def,
      ar,
      co,
    },
    valueFormatter,
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
    },
  };
};
