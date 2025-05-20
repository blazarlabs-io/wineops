import { GROUP_ITEMS_TO_SHOW } from "@/data/constants";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GrapeVarietyCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => {
  const uniqueValues: string[] =
    value && Array.isArray(value) ? [...new Set(value.flat(Infinity))] : [];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={0.5}
      className="h-full"
    >
      {uniqueValues.length > 0 ? (
        uniqueValues.map((v, index) => (
          <Box key={index}>
            {index < GROUP_ITEMS_TO_SHOW ? (
              <p className="leading-[1] truncate">{v}</p>
            ) : (
              index === GROUP_ITEMS_TO_SHOW && (
                <p className="leading-[1] m-[0px] p-[0px] text-muted-foreground underline cursor-pointer">
                  + {uniqueValues.length - GROUP_ITEMS_TO_SHOW} more
                </p>
              )
            )}
          </Box>
        ))
      ) : (
        <p className="leading-[1] truncate">{value}</p>
      )}
    </Box>
  );
};
