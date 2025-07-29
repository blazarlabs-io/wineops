import { IconButton, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
import {
  DEFAULT_LOCALE,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED_MUST,
} from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import formatDate from "@/utils/date-format";
import StatusDataDisplay from "@/components/data-display/status-data-display";
import { useVessel } from "@/context/vessel";
import StorageDetailsWidget from "@/components/widgets/storage/storage-details-widget";

export const GroupCellRenderer: FunctionComponent<
  CustomCellRendererProps & { storageType?: number }
> = (params) => {
  const { value, data, node, storageType } = params;

  const isGroup = node?.group || node?.data?.rowType === "group";
  const groupField = isGroup ? node?.field : node?.parent?.field;

  const [expanded, setExpanded] = useState<boolean>(node.expanded);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(
      node.expanded ? ROW_HEIGHT_EXPANDED_MUST : ROW_HEIGHT_DEFAULT,
    );
  }, [node]);

  const uniqueMusts =
    isGroup && groupField === "groupByLocation"
      ? [...new Set(node?.allLeafChildren?.map(({ data }) => data.name))]
      : undefined;

  const { vessels } = useVessel();
  const filteredVessels =
    isGroup && groupField === "groupByLocation"
      ? vessels.filter(({ rowType }) => rowType === "item")
      : undefined;

  const locationMap = filteredVessels
    ? filteredVessels.reduce((map, vessel) => {
        const loc = vessel.location ?? "Unknown";
        map.set(loc, (map.get(loc) ?? 0) + 1);
        return map;
      }, new Map<string, number>())
    : undefined;

  return (
    <>
      <Stack
        gap={1}
        justifyContent="center"
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
          <Stack justifyContent="center">
            <Typography variant="body1" sx={{ whiteSpace: "normal" }}>
              {value ? (
                groupField === "groupByVesselType" ? (
                  <>
                    {node?.allChildrenCount} {value}(s)
                  </>
                ) : groupField === "groupByLocation" ? (
                  <>
                    {value}
                    <br />
                    <Typography component="span" variant="body2" sx={{ pl: 0 }}>
                      {uniqueMusts?.length}{" "}
                      {storageType === 1 ? "wine" : "must"}(s) /{" "}
                      {locationMap?.get(value || "Unknown")} vessel(s)
                    </Typography>
                  </>
                ) : (
                  value
                )
              ) : (
                <>
                  {node?.allChildrenCount}{" "}
                  <i>
                    Unknown{" "}
                    {groupField === "groupByLocation"
                      ? "location"
                      : groupField === "groupByWineName"
                        ? "wine name"
                        : groupField === "groupByVesselType"
                          ? "vessel type"
                          : ""}
                    (s)
                  </i>
                  {groupField === "groupByLocation" ? (
                    <>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ pl: 0 }}
                      >
                        {uniqueMusts?.length}{" "}
                        {storageType === 1 ? "wine" : "must"}(s) /{" "}
                        {locationMap?.get(value || "Unknown")} vessel(s)
                      </Typography>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center">
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
                  className="fixed bottom-0 border-t flex items-start left-0 w-full h-[219px] bg-transparent z-[9999]"
                >
                  <StorageDetailsWidget must={node.data} />
                </Stack>
              )}
            </Stack>
            <Stack justifyContent="center">
              {groupField === "groupByStatus" ? (
                <>
                  {data?.date && (
                    <Typography variant="body2">
                      {formatDate(data?.date, { locale: DEFAULT_LOCALE })}
                    </Typography>
                  )}
                  {<StatusDataDisplay status={data?.status} />}
                </>
              ) : (
                <>
                  <Typography variant="body1">{data?.name}</Typography>
                  <Typography variant="body1">{data?.grapeVariety}</Typography>
                </>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
