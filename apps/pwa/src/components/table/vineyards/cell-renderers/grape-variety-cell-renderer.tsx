import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Tooltip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useState, type FunctionComponent } from "react";

export const GrapeVarietyCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => {
  const uniqueValues = useMemo(() => {
    return value && Array.isArray(value)
      ? [...new Set(value.flat(Infinity))]
      : [];
  }, [value]);

  const [tooltipText, setTooltipText] = useState<string>("");

  useEffect(() => {
    if (uniqueValues.length > 0) {
      setTooltipText(uniqueValues.join(", "));
    } else {
      setTooltipText("");
    }
  }, [uniqueValues]);

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
        <div
          style={{
            height: ROW_HEIGHT_DEFAULT,
            gap: 1,
          }}
          className="flex flex-col justify-center"
        >
          {uniqueValues.map((v, index) => (
            <>
              {index <= 2 && (
                <Box
                  key={index}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  maxHeight={"fit-content"}
                  className=""
                  sx={{
                    visibility: index <= 2 ? "visible" : "hidden",
                  }}
                >
                  {index < 2 ? (
                    <p className="leading-[1] truncate">{v}</p>
                  ) : (
                    index === 2 && (
                      <Tooltip title={tooltipText} placement="bottom-start">
                        <Typography
                          variant="body2"
                          color="primary"
                          className="leading-[1] m-[0px] p-[0px] text-muted-foreground underline cursor-pointer"
                        >
                          + {uniqueValues.length - 2} more
                        </Typography>
                      </Tooltip>
                    )
                  )}
                </Box>
              )}
            </>
          ))}
        </div>
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
