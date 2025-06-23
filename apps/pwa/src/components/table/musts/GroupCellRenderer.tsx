import { IconButton, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
import {
  DEFAULT_LOCALE,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED_MUST,
} from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import MustDetailsWidget from "@/components/widgets/must/must-details-widget";
import formatDate from "@/utils/date-format";
import StatusDataDisplay from "@/components/data-display/status-data-display";
import { Vessel } from "@/models/types/db";
import EntityLocation from "../EntityLocation";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, data, node } = params;

  /**
   * node?.group - AG Grid group
   * node?.data?.rowType === "group" - Our custom grouping system
   */
  const isGroup = node?.group || node?.data?.rowType === "group";
  const groupField = isGroup ? node?.field : node?.parent?.field;

  const [expanded, setExpanded] = useState<boolean>(node.expanded);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(
      node.expanded ? ROW_HEIGHT_EXPANDED_MUST : ROW_HEIGHT_DEFAULT
    );
  }, [node]);

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
                    {value}{" "}
                    <Typography component="span" variant="body2" sx={{ pl: 1 }}>
                      {node?.allChildrenCount} vessel(s)
                    </Typography>
                  </>
                ) : (
                  value
                )
              ) : (
                <i>Unknown</i>
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
                  <MustDetailsWidget must={node.data} />
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
              ) : groupField === "groupByVesselType" ||
                groupField === "groupByLocation" ? (
                <Stack my={2} sx={{ height: "100%", justifyContent: "center" }}>
                  {(data?.vesselId
                    ? [
                        {
                          id: data?.vesselId,
                          name: data?.vesselName,
                          location: data?.vesselLocation,
                          type: data?.vesselType,
                        },
                      ]
                    : data?.vessels
                  )?.map((vessel: Vessel) => (
                    <Stack
                      key={vessel?.id}
                      direction="row"
                      sx={{ flexWrap: "wrap", whiteSpace: "wrap" }}
                    >
                      <Typography key={vessel?.id} variant="body1">
                        {vessel?.name}
                      </Typography>
                      <EntityLocation location={vessel?.location || ""} />
                    </Stack>
                  ))}
                </Stack>
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
