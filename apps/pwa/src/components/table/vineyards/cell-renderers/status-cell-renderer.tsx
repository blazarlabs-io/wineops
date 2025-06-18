import VineyardMultiStatusDataDisplay from "@/components/data-display/multi-status-data-display";
import StatusDataDisplaySelect from "@/components/data-display/status-data-display-select";
import StatusDialog from "@/components/dialogs/status-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useSortVineyardStatuses } from "@/hooks/use-sort-vineyard-statuses";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { EntityStatus } from "@/models/types/dashboard";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState, type FunctionComponent } from "react";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { vineyardStatuses } = useSortVineyardStatuses(
    params?.node?.aggData?.status
  );

  const { user } = useAuth();

  const [open, setOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOnSelect = async (status: EntityStatus) => {
    const res = await db.vineyard.update(user?.uid, params.node.data.id, {
      status: status,
    });

    if (res.status === 200) {
      enqueueSnackbar("Status updated successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Error updating status", { variant: "error" });
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
      {!params.node.group ? (
        <StatusDataDisplaySelect
          status={params.value}
          onSelect={handleOnSelect}
        />
      ) : (
        <>
          <StatusDialog
            open={open}
            onClose={handleClose}
            data={vineyardStatuses}
          />
          {vineyardStatuses && vineyardStatuses.length > 0 && (
            <VineyardMultiStatusDataDisplay
              status={vineyardStatuses}
              onOpen={handleOpen}
            />
          )}
        </>
      )}
    </Box>
  );
};
