import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GrapeVarietyCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => {
  const uniqueValues: string[] =
    value && Array.isArray(value) ? [...new Set(value.flat(Infinity))] : [];
  return (
    <>
      {uniqueValues.length > 0 ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={0.5}
          className="h-full"
        >
          {uniqueValues.map((v, index) => (
            <Box key={index}>
              {index < 2 ? (
                <p className="leading-[1] truncate">{v}</p>
              ) : (
                index === 2 && (
                  <Typography
                    variant="body2"
                    color="primary"
                    className="leading-[1] m-[0px] p-[0px] text-muted-foreground underline cursor-pointer"
                  >
                    + {uniqueValues.length - 2} more
                  </Typography>
                )
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={0.5}
          className="h-full"
        >
          <p className="leading-[1] truncate">{value}</p>
        </Box>
      )}
    </>
  );
};
