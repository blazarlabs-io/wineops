/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import formatDate from "@/utils/date-format";
import { DEFAULT_LOCALE, GROUP_ITEMS_TO_SHOW } from "@/data/constants";
import StatusDataDisplay from "@/components/data-display/status-data-display";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const { key, aggData } = node;

  const batchId = aggData?.batchId ?? [];

  const isGroup =
    batchId &&
    Array.isArray(batchId) &&
    batchId.every((item) => item && Array.isArray(item) && !!item[0]);

  const batchesDateLocation = isGroup
    ? batchId
        .flat()
        .map(
          ({ date, location }) =>
            `${date ? formatDate(date, { locale: DEFAULT_LOCALE }) : ""}***${location ?? ""}`
        )
    : [];

  const uniqueDateLocation = [
    ...new Set(batchesDateLocation.map((item) => item)),
  ].map((item) => {
    const [date, location] = item.split("***");

    return { date, location };
  });

  const rowData =
    batchId && Array.isArray(batchId)
      ? batchId.find((data: any) => data?.name === key || data[0]?.name === key)
      : [];

  const detailedData =
    !isGroup && (node?.data ?? (Array.isArray(rowData) ? rowData[0] : rowData));

  const rowName = value && Array.isArray(value) ? "" : value;

  const isDetailed = (value && Array.isArray(value)) || !!detailedData;

  return (
    <>
      <Stack
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          minHeight: "86px",
          height: "100%",
        }}
      >
        {isDetailed ? (
          <>
            {detailedData?.date && (
              <Typography variant="body2">
                {formatDate(detailedData?.date, { locale: DEFAULT_LOCALE })}
              </Typography>
            )}
            {<GrapeLocation location={detailedData?.location} />}
            {<StatusDataDisplay status={detailedData?.status} />}
          </>
        ) : (
          <Stack>
            <Typography>{rowName}</Typography>
            {uniqueDateLocation.map(({ date, location }: any, index: number) =>
              index < GROUP_ITEMS_TO_SHOW ? (
                <Stack
                  key={`${date}-${location}`}
                  direction={uniqueDateLocation.length === 1 ? "column" : "row"}
                >
                  <Typography variant="body2">{date}</Typography>
                  <GrapeLocation location={location} />
                </Stack>
              ) : (
                index === GROUP_ITEMS_TO_SHOW && (
                  <Link href="#" sx={{ lineHeight: 1 }}>
                    + {uniqueDateLocation.length - GROUP_ITEMS_TO_SHOW} more
                  </Link>
                )
              )
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};

const GrapeLocation = ({ location }: { location: string }) =>
  location && (
    <Stack direction="row" alignItems="center">
      <LocationOnOutlinedIcon
        sx={(theme) => ({
          width: theme.typography.body1.fontSize,
          height: theme.typography.body1.fontSize,
          color: theme.palette.text.secondary,
        })}
      />
      <Typography variant="body2">{location}</Typography>
    </Stack>
  );
