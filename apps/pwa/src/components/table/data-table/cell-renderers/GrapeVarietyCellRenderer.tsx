/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GrapeVarietyCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => {
  return (
    <>
      {value && typeof value !== "string" ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={0.5}
          className="h-full"
        >
          {[...new Set(value)].map((v: any, index: number) => (
            <Box key={index}>
              {index < 2 ? (
                <p className="leading-[1] truncate">{v}</p>
              ) : (
                index === 2 && (
                  <p className="leading-[1] m-[0px] p-[0px] text-muted-foreground underline cursor-pointer">
                    + {value.length - 2} more
                  </p>
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
