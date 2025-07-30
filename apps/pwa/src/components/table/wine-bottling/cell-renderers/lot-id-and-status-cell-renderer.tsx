import BottlingStatusDataDisplaySelect from "@/components/data-display/bottling-status-data-display-select";
import LotIdAndLotStatusDialog from "@/components/dialogs/lot-id-lot-status-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { db } from "@/lib/firebase/services";
import { LotStatus } from "@/models/types/db";
import { Box, Button, Chip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { enqueueSnackbar } from "notistack";

export const LotIdAndStatusCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  const { user } = useAuth();
  const [openLots, setOpenLots] = useState<boolean>(false);
  const isGroup = node?.group || node?.data?.rowType === "group";

  const handleStatusChange = async (status: LotStatus) => {
    const statusRes = await db.bottle.update(user?.uid, node.data.id, {
      lotStatus: status,
    });

    if (statusRes.status === 200) {
      enqueueSnackbar("Lot status updated", { variant: "success" });
    } else {
      enqueueSnackbar("Error updating lot status", { variant: "error" });
    }
  };

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup ? (
        <div className="flex flex-col items-start justify-start gap-[4px]!">
          <Typography variant="body2" className="font-semibold max-h-fit!">
            {value || "Lot ID N/A"}
          </Typography>
          <BottlingStatusDataDisplaySelect
            status={node.data?.lotStatus || LotStatus.PLANNED}
            onSelect={handleStatusChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-[4px]!">
          {node.allLeafChildren &&
            node.allLeafChildren.length > 0 &&
            node.allLeafChildren.map((_node: any, index: number) => (
              <div
                key={_node.id + node.data?.lotId + index}
                className="leading-8!"
                style={{
                  display: index === 0 ? "block" : "none",
                }}
              >
                <Typography
                  variant="body2"
                  className="font-semibold max-h-fit!"
                >
                  {_node.data.lotId || "N/A"}
                </Typography>
                <Chip
                  label={_node.data.lotStatus || LotStatus.PLANNED}
                  variant="outlined"
                  size="small"
                  className="m-0! p-1! max-h-fit text-xs!"
                />
              </div>
            ))}
          <div className="max-w-fit max-h-fit! leading-0!">
            <Button
              type="button"
              variant="text"
              size="small"
              color="primary"
              className="lowercase!"
              sx={{
                maxWidth: "fit-content",
                padding: "0px !important",
                maxHeight: "fit-content !important",
              }}
              onClick={() => setOpenLots(true)}
            >
              {node?.allLeafChildren?.length &&
                node?.allLeafChildren?.length - 1 > 0 && (
                  <Typography
                    variant="body2"
                    className="font-semibold max-h-fit!"
                  >
                    {node?.allLeafChildren?.length - 1} more lots
                  </Typography>
                )}
            </Button>
          </div>
        </div>
      )}
      <LotIdAndLotStatusDialog
        open={openLots}
        onClose={() => setOpenLots(false)}
        ids={
          node?.allLeafChildren?.map((_node: any) =>
            _node.data?.lotId?.length > 0 ? _node.data?.lotId : ["Lot ID N/A"],
          ) || []
        }
        statuses={
          node?.allLeafChildren?.map((_node: any) =>
            _node.data?.lotStatus?.length > 0
              ? _node.data?.lotStatus
              : [LotStatus.PLANNED],
          ) || []
        }
      />
    </Box>
  );
};
