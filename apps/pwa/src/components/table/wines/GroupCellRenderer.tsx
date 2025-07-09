import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED_MUST } from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import WineDetailsWidget from "@/components/widgets/wine/wine-details-widget";
import { GrapeVariety } from "@/models/types/db";
import { formatNumberWithUnit } from "@/utils/number-format";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, data, node } = params;

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

  const grapeVarieties =
    (isGroup
      ? (node?.aggData?.grapeVarieties ??
        node?.allLeafChildren?.map(({ data }) => data?.grapeVarieties))
      : data?.grapeVarieties) || [];

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
                <>
                  {node?.allChildrenCount} <i>Unknown(s)</i>
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
                  <WineDetailsWidget wine={node.data} />
                </Stack>
              )}
            </Stack>
            <Stack justifyContent="center">
              <Typography variant="body1">{data?.name}</Typography>
              {grapeVarieties.length === 0 ? (
                <></>
              ) : (
                <>
                  {grapeVarieties.length === 1 ? (
                    <Typography key={grapeVarieties[0].id} variant="body2">
                      {grapeVarieties[0]?.name}
                      {(grapeVarieties[0]?.percentage || 0) < 100 && (
                        <>
                          {" "}
                          -{" "}
                          {formatNumberWithUnit(
                            grapeVarieties[0]?.percentage,
                            "%"
                          )}
                        </>
                      )}
                    </Typography>
                  ) : (
                    <>
                      <Tooltip
                        title={grapeVarieties?.map((variety: GrapeVariety) => (
                          <Stack
                            key={variety?.id}
                            sx={{ flexWrap: "wrap", whiteSpace: "wrap" }}
                          >
                            <Typography key={variety?.id} variant="body1">
                              {variety?.name} - {variety?.percentage}%
                            </Typography>
                          </Stack>
                        ))}
                      >
                        <Typography variant="body1" className="underline">
                          Grape varieties
                        </Typography>
                      </Tooltip>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
