/* eslint-disable @typescript-eslint/no-explicit-any */
import BottlingDateDialog from "@/components/dialogs/bottling-date-dialog";
import LocationDialog from "@/components/dialogs/location-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { CalendarMonth } from "@mui/icons-material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Button, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";

export const BottlingDateCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  const [openLocations, setOpenLocations] = useState<boolean>(false);

  const isGroup = node?.group || node?.data?.rowType === "group";

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup ? (
        <div className="flex items-center justify-start gap-[4px]! ">
          <CalendarMonth
            sx={({ typography }) => ({
              width: typography.body1.fontSize,
              height: typography.body1.fontSize,
            })}
          />
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
                <div
                  className="flex fle-row items-center gap-[4px]! w-full"
                  style={{
                    display: index < 2 ? "flex" : "none",
                  }}
                >
                  <CalendarMonth
                    sx={({ typography }) => ({
                      width: typography.body1.fontSize,
                      height: typography.body1.fontSize,
                    })}
                  />
                  <Typography
                    variant="body2"
                    className="font-semibold max-h-fit!"
                  >
                    {item}
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
                    more dates
                  </Button>
                )}
              </div>
            ))}
          <BottlingDateDialog
            open={openLocations}
            onClose={() => setOpenLocations(false)}
            data={value}
          />
        </div>
      )}
    </Box>
  );
};
