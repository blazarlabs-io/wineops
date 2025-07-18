/* eslint-disable @typescript-eslint/no-explicit-any */
import LocationDialog from "@/components/dialogs/location-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Button, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";

export const LocationCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  const [openLocations, setOpenLocations] = useState<boolean>(false);

  const isGroup = node?.group || node?.data?.rowType === "group";

  if (isGroup) console.log(node);

  console.log("\n\nXXXXXXXXXXXXXXXXXXXXXx");
  console.log("IS GROUP", isGroup);
  console.log("VALUE", value);
  console.log("NODE", node);
  console.log("\n\nXXXXXXXXXXXXXXXXXXXXXx");

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup ? (
        <div className="flex items-center justify-start gap-[2px]! ">
          <LocationOnOutlinedIcon
            sx={({ typography }) => ({
              width: typography.body1.fontSize,
              height: typography.body1.fontSize,
            })}
          />
          <Typography variant="body2" className="font-semibold max-h-fit!">
            {value || "N/A"}
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-[4px]!">
          {value &&
            value.length > 0 &&
            value.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  display: index <= 2 ? "flex" : "none",
                }}
                className="max-w-fit max-h-fit! leading-0!"
              >
                <div
                  className="flex fle-row items-center gap-[2px]! w-full"
                  style={{
                    display: index < 2 ? "flex" : "none",
                  }}
                >
                  <LocationOnOutlinedIcon
                    sx={({ typography }) => ({
                      width: typography.body1.fontSize,
                      height: typography.body1.fontSize,
                    })}
                  />
                  <Typography
                    variant="body2"
                    className="font-semibold max-h-fit!"
                  >
                    {item || "N/A"}
                  </Typography>
                </div>
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
                    onClick={() => setOpenLocations(true)}
                  >
                    {node?.allLeafChildren?.length &&
                      node?.allLeafChildren?.length - 2}{" "}
                    more locations
                  </Button>
                )}
              </div>
            ))}
          <LocationDialog
            open={openLocations}
            onClose={() => setOpenLocations(false)}
            data={value}
          />
        </div>
      )}
    </Box>
  );
};
