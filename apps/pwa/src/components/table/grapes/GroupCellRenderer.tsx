/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Link, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import formatDate from "@/utils/date-format";
import {
  DEFAULT_LOCALE,
  GROUP_ITEMS_TO_SHOW,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED_GRAPE,
} from "@/data/constants";
import StatusDataDisplay from "@/components/data-display/status-data-display";
import { ExpandMore } from "@mui/icons-material";
import GrapeDetailsWidget from "@/components/widgets/grape/grape-details-widget";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, node } = params;

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(
      node.expanded ? ROW_HEIGHT_EXPANDED_GRAPE : ROW_HEIGHT_DEFAULT
    );
  }, [node]);

  useEffect(() => {
    setExpanded(node.expanded);
  }, [node.expanded]);

  const batchId: any[] = node?.aggData?.batchId ?? [];
  const isGroup = node?.group || node?.data?.rowType === "group";

  const batchesDateLocation = isGroup
    ? batchId.map(
        (batch) =>
          `${batch?.date ? formatDate(batch?.date, { locale: DEFAULT_LOCALE }) : ""}***${batch?.location ?? ""}`
      )
    : [];

  const uniqueDateLocation = [
    ...new Set(batchesDateLocation.map((item) => item)),
  ]
    .filter((item) => item !== "***")
    .map((item) => {
      const [date, location] = item.split("***");

      return { date, location };
    });

  return (
    <>
      <Stack
        justifyContent="center"
        gap={1}
        justifyItems="flex-start"
        height={ROW_HEIGHT_DEFAULT}
        sx={{
          borderLeft: node.level > 0 ? "8px" : "",
          borderStyle: "solid",
          borderColor: "var(--mui-palette-divider)",
          pl: isGroup ? 2 : 0,
          ml: 2,
        }}
      >
        {isGroup ? (
          <Stack justifyItems="center">
            <Typography variant="body1">
              {(node?.field === "entry" ? value?.location1 : value) ?? (
                <i>unknown {node?.field}</i>
              )}
            </Typography>
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
                  <Link href="#" key={index}>
                    + {uniqueDateLocation.length - GROUP_ITEMS_TO_SHOW} more
                  </Link>
                )
              )
            )}
          </Stack>
        ) : (
          <Stack direction="row">
            <Stack direction="row">
              <div className="flex items-center gap-2">
                <IconButton
                  type="button"
                  size="small"
                  onClick={handleMasterDetailExpansion}
                >
                  <ExpandMore
                    style={{
                      rotate: expanded ? "0deg" : "-90deg",
                    }}
                    className="max-w-5 max-h-5 opacity-60"
                  />
                </IconButton>
              </div>
              {expanded && (
                <Stack className="fixed bottom-0 flex items-center justify-center left-0 w-full h-[364px] bg-transparent z-[9999]">
                  <GrapeDetailsWidget grape={node.data} />
                </Stack>
              )}
            </Stack>
            <Stack justifyContent="center">
              {node?.data?.date && (
                <Typography variant="body2">
                  {formatDate(node?.data?.date, { locale: DEFAULT_LOCALE })}
                </Typography>
              )}
              {<GrapeLocation location={node?.data?.location} />}
              {<StatusDataDisplay status={node?.data?.status} />}
            </Stack>
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
