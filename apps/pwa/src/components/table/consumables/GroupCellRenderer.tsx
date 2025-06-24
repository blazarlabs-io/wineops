import { IconButton, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
import {
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED_VESSEL,
} from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import ConsumableDetailsWidget from "@/components/widgets/consumable/consumable-details-widget";
import GroupBadge from "../group-badge";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, data, node } = params;

  const [expanded, setExpanded] = useState<boolean>(node.expanded);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(
      node.expanded ? ROW_HEIGHT_EXPANDED_VESSEL : ROW_HEIGHT_DEFAULT
    );
  }, [node]);

  const isGroup = node?.group || node?.data?.rowType === "group";

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
              {value ? value : <i>Unknown</i>}
              <GroupBadge content={node?.allChildrenCount} />
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
                  className="fixed bottom-0 border-t flex items-start justify-center left-0 w-full h-[189px] bg-transparent z-[9999]"
                >
                  <ConsumableDetailsWidget consumable={node.data} />
                </Stack>
              )}
            </Stack>
            <Stack justifyContent="center">
              <Typography variant="body1">{data?.category}</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
