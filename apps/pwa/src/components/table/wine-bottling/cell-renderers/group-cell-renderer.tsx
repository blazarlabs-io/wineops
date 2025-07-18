/* eslint-disable @typescript-eslint/no-explicit-any */
import CollectionsDialog from "@/components/dialogs/collections-dialog";
import BottlingDetailsWidget from "@/components/widgets/bottling/bottling-details-widget";
import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED } from "@/data/constants";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ExpandMore } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const [expanded, setExpanded] = useState<boolean>(node.expanded);
  const [openCollections, setOpenCollections] = useState<boolean>(false);

  // * master detail custom renderer
  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(node.expanded ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT_DEFAULT);
  }, [node]);

  const isGroup = node?.group || node?.data?.rowType === "group";

  return (
    <Box
      display={"flex"}
      //flexDirection={"column"}
      justifyContent={"center"}
      gap={1}
      justifyItems={"flex-start"}
      height={ROW_HEIGHT_DEFAULT}
      sx={{
        borderLeft: node.level > 0 ? "8px" : "",
        borderStyle: "solid",
        borderColor: "var(--mui-palette-divider)",
        pl: !isGroup ? 0 : 2,
        ml: !isGroup ? 2 : 2,
      }}
      className="w-full flex flex-col items-start gap-2"
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyItems={"flex-between"}
        gap={0}
        className="w-full pr-8"
      >
        <Box>
          {!isGroup && (
            <>
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
                <div
                  style={{ borderColor: "var(--mui-palette-divider)" }}
                  className="fixed bottom-0 border-t flex items-center justify-center left-0 w-full h-[300px] bg-transparent z-[9999]"
                >
                  <BottlingDetailsWidget bottle={node.data} />
                </div>
              )}
            </>
          )}
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={0}>
          {isGroup ? (
            <>
              <Typography variant="body1" className="max-h-fit">
                {node?.key}
              </Typography>
              {node?.allLeafChildren &&
                node?.allLeafChildren?.length > 0 &&
                node?.allLeafChildren?.map((child, index) => (
                  <div key={child.key} className="flex items-center gap-1">
                    {node?.allLeafChildren?.length === 1 ? (
                      <Typography variant="caption">
                        {child.data?.name}
                      </Typography>
                    ) : (
                      <>
                        {index === 0 && (
                          <Button
                            type="button"
                            key={index}
                            variant="text"
                            size="small"
                            color="primary"
                            className="lowercase!"
                            sx={{ maxWidth: "fit-content", padding: 0 }}
                            onClick={() => setOpenCollections(true)}
                          >
                            {node?.allLeafChildren?.length} collections
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                ))}
            </>
          ) : (
            <>
              <Typography variant="body1" className="max-h-fit">
                {node?.data?.name || node?.data?.collectionName || "N/A"}
              </Typography>
              <div className="flex items-center gap-1">
                <Icon icon="formkit:date" width="12" height="12" />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-h-fit"
                >
                  {node?.data?.vintage}
                </Typography>
              </div>
            </>
          )}
        </Box>
      </Box>
      {isGroup &&
        node?.allLeafChildren !== undefined &&
        Array.isArray(node?.allLeafChildren) &&
        node?.allLeafChildren?.length > 0 && (
          <CollectionsDialog
            open={openCollections}
            onClose={() => setOpenCollections(false)}
            data={node?.allLeafChildren?.map((child: any) => child.data)}
          />
        )}
    </Box>
  );
};
