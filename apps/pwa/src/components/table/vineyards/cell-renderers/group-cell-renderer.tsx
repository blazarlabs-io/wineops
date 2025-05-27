import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED } from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import { Badge, Box, IconButton, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  // * master detail custom renderer
  const handleMasterDetailExpansion = useCallback(() => {
    console.log(node);
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(node.expanded ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT_DEFAULT);
  }, []);

  useEffect(() => {
    setExpanded(node.expanded);
  }, [node.expanded]);

  const isGroup = node?.group || node?.data?.rowType === "group";

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
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
      <Badge
        overlap="circular"
        badgeContent={node.allChildrenCount}
        sx={{
          position: "absolute",
          top: "50%",
          right: 32,
          transform: "translateY(-50%)",
          "& .MuiBadge-badge": {
            border: `2px solid ${"var(--mui-palette-text-secondary)"}`,
            color: "var(--mui-palette-text-secondary)",
            padding: "0 4px",
            borderWidth: "1px",
          },
        }}
      />

      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyItems={"flex-between"}
        gap={0}
        className="w-full"
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
                      rotate: expanded ? "0deg" : "-90deg",
                    }}
                    className="max-w-5 max-h-5 opacity-60"
                  />
                </IconButton>
              </div>
              {expanded && (
                <div className="fixed bottom-0 flex items-center justify-center left-0 w-full h-[300px] bg-transparent z-[9999]">
                  <VineyardDetailsWidget vineyard={node.data} />
                </div>
              )}
            </>
          )}
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <Typography variant="body1" className="max-h-fit">
            {value}
          </Typography>

          {node.data && node.data.info && node.data.info.certifications ? (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyItems: "flex-start",
              }}
            >
              <CertificationsDataDisplay
                certifications={node.data.info.certifications}
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <CertificationsDataDisplay
                certifications={{
                  eco: { active: false, fileUrl: "" },
                  igp: { active: false, fileUrl: "" },
                  dop: { active: false, fileUrl: "" },
                }}
              />
            </div>
          )}
          {!isGroup && (
            <p className="max-h-fit min-h-fit leading-4">
              {node.data.cadastralNumber}
            </p>
          )}
        </Box>
      </Box>
    </Box>
  );
};
