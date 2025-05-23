import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Typography } from "@mui/material";
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
      sx={{
        height: ROW_HEIGHT_DEFAULT,
      }}
      className=""
    >
      {uniqueValues.length > 0 ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"start"}
          gap={1}
          sx={{
            height: ROW_HEIGHT_DEFAULT,
          }}
        >
          {uniqueValues.map((v, index) => (
            <Box
              key={index}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
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
          sx={{
            height: ROW_HEIGHT_DEFAULT,
          }}
        >
          <p className="leading-[1] truncate">{value}</p>
        </Box>
      )}
    </Box>
  );
};
