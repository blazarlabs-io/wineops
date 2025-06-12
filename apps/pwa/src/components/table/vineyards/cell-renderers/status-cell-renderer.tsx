import type { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, type FunctionComponent } from "react";
import { useSortVineyardStatuses } from "@/hooks/use-sort-vineyard-statuses";
import VineyardStatusDataDisplay from "@/components/data-display/status-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import VineyardMultiStatusDataDisplay from "@/components/data-display/multi-status-data-display";
import { EntityStatus } from "@/models/types/dashboard";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { enqueueSnackbar } from "notistack";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { vineyardStatuses } = useSortVineyardStatuses(
    params?.node?.aggData?.status
  );

  const { user } = useAuth();

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
        <VineyardStatusDataDisplay
          status={params.value}
          onSelect={handleOnSelect}
        />
      ) : (
        <>
          {vineyardStatuses && vineyardStatuses.length > 0 && (
            <VineyardMultiStatusDataDisplay status={vineyardStatuses} />
          )}
        </>
      )}
    </Box>
  );
};
