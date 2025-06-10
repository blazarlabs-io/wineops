import type { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, type FunctionComponent } from "react";
import { useSortVineyardStatuses } from "@/hooks/use-sort-vineyard-statuses";
import VineyardStatusDataDisplay from "@/components/data-display/status-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import VineyardMultiStatusDataDisplay from "@/components/data-display/multi-status-data-display";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  console.log(params);
  const { vineyardStatuses } = useSortVineyardStatuses(
    params?.node?.aggData?.status
  );

  useEffect(() => {
    if (vineyardStatuses && vineyardStatuses.length > 0) {
      console.log("vineyardStatuses", vineyardStatuses);
    }
  }, [vineyardStatuses]);
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params.node.group ? (
        <VineyardStatusDataDisplay status={params.value} />
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
