/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Button, Chip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";

export const LocationCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  const [openCollections, setOpenCollections] = useState<boolean>(false);

  const isGroup = node?.group || node?.data?.rowType === "group";

  if (isGroup) {
    console.log("\n\nXXXXXXXXXXXXXXXXXXXXXX");
    console.log(node, value);
    console.log("XXXXXXXXXXXXXXXXXXXXXX\n\n");
  }

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup ? (
        <div className="flex flex-col items-start justify-start gap-[4px]! ">
          <Typography variant="body2" className="font-semibold max-h-fit!">
            {value}
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-[4px]!">
          {value &&
            value.length > 0 &&
            value.map((item: any, index: number) => (
              <div key={index} className="max-w-fit max-h-fit! leading-0!">
                <Typography
                  variant="body2"
                  className="font-semibold max-h-fit!"
                  style={{
                    display: index < 2 ? "block" : "none",
                  }}
                >
                  {item}
                </Typography>
                {index === 2 && (
                  <Button
                    type="button"
                    key={index}
                    variant="text"
                    size="small"
                    color="primary"
                    className="lowercase!"
                    sx={{
                      maxWidth: "fit-content",
                      padding: "0px !important",
                      maxHeight: "fit-content !important",
                    }}
                    onClick={() => setOpenCollections(true)}
                  >
                    {node?.allLeafChildren?.length &&
                      node?.allLeafChildren?.length - 2}{" "}
                    more locations
                  </Button>
                )}
              </div>
            ))}
        </div>
      )}
    </Box>
  );
};
