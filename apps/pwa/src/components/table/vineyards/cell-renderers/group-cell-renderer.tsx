import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED } from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";
import GroupBadge from "../../group-badge";
import CadastralDialog from "@/components/dialogs/cadastral-dialog";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const [expanded, setExpanded] = useState<boolean>(node.expanded);
  const [openCadastrals, setOpenCadastrals] = useState<boolean>(false);

  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!node.expanded);
    node.setExpanded(!node.expanded);
    node.setRowHeight(node.expanded ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT_DEFAULT);
  }, [node]);

  const isGroup = node?.group || node?.data?.rowType === "group";

  return (
    <Box
      display={"flex"}
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
      data-id={node.data?.id}
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
                  bio: { active: false, fileUrl: "" },
                  igp: { active: false, fileUrl: "" },
                  dop: { active: false, fileUrl: "" },
                  ice: { active: false, fileUrl: "" },
                }}
              />
            </div>
          )}
          {!isGroup && (
            <div className="flex flex-col gap-0">
              {node.data.cadastralNumber !== undefined &&
                Array.isArray(node.data.cadastralNumber) &&
                node.data.cadastralNumber.length > 0 &&
                node.data.cadastralNumber?.map(
                  (cadastralNumber: string, index: number) => (
                    <div
                      key={index + cadastralNumber}
                      className="flex p-[0px]! m-[0px]! items-center"
                    >
                      {node.data.cadastralNumber.length === 1 ? (
                        <Typography variant="caption">
                          {cadastralNumber}
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
                              onClick={() => setOpenCadastrals(true)}
                            >
                              {node.data.cadastralNumber.length} cadastral
                              numbers
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ),
                )}
            </div>
          )}
        </Box>
        <GroupBadge content={node?.allChildrenCount} />
      </Box>
      {node.data &&
        node.data !== undefined &&
        Array.isArray(node.data.cadastralNumber) &&
        node.data.cadastralNumber.length > 0 && (
          <CadastralDialog
            open={openCadastrals}
            onClose={() => setOpenCadastrals(false)}
            data={node.data.cadastralNumber}
          />
        )}
    </Box>
  );
};
