/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Link, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
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
import EntityLocation from "../EntityLocation";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, node } = params;

  const [expanded, setExpanded] = useState<boolean>(node.expanded);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(
      node.expanded ? ROW_HEIGHT_EXPANDED_GRAPE : ROW_HEIGHT_DEFAULT
    );
  }, [node]);

  const batchId: any[] =
    node?.aggData?.batchId ??
    node?.allLeafChildren?.map(({ data }) => data?.batchId) ??
    [];

  const isGroup = node?.group || node?.data?.rowType === "group";

  const batchesDateLocation =
    isGroup && Array.isArray(batchId)
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
        gap={1}
        justifyContent="center"
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
          node?.field === "groupByDate" ? (
            <>
              {value ? (
                formatDate(value, { locale: DEFAULT_LOCALE })
              ) : (
                <i>Unknown date</i>
              )}
            </>
          ) : node?.field === "groupByVariety" ? (
            <>{value ? value : <i>Unknown variety</i>}</>
          ) : node?.field === "groupByLocation" ? (
            <>{value ? value : <i>Unknown location</i>}</>
          ) : (
            <Stack justifyItems="center">
              <Typography variant="body1">{value}</Typography>
              {uniqueDateLocation.map(
                ({ date, location }: any, index: number) =>
                  index < GROUP_ITEMS_TO_SHOW ? (
                    <Stack
                      key={`${date}-${location}`}
                      direction={
                        uniqueDateLocation.length === 1 ? "column" : "row"
                      }
                    >
                      <Typography variant="body2">{date}</Typography>
                      <EntityLocation location={location} />
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
          )
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
                      rotate: expanded ? "180deg" : "0deg",
                    }}
                    className="max-w-5 max-h-5 opacity-60"
                  />
                </IconButton>
              </div>
              {expanded && (
                <Stack
                  style={{ borderColor: "var(--mui-palette-divider)" }}
                  className="fixed bottom-0 border-t flex items-center left-0 w-full h-[259px] bg-transparent z-[9999]"
                >
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
              {<EntityLocation location={node?.data?.location} />}
              {<StatusDataDisplay status={node?.data?.status} />}
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
