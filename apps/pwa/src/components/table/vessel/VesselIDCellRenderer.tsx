/* eslint-disable @typescript-eslint/no-explicit-any */
import { GROUP_ITEMS_TO_SHOW, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const VesselIDCellRenderer = (params: CustomCellRendererProps) => {
  const { value, data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  const groupedVessels = isGroup
    ? (value ?? []).flat(Infinity).reduce((acc: any, item: any = "vessel") => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {})
    : [];

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <>
          {
            <Stack justifyContent="center">
              {Object.entries(groupedVessels).map(
                ([type, count]: any, index: number) =>
                  index < GROUP_ITEMS_TO_SHOW ? (
                    <Typography key={type} variant="body1">
                      {count} {type}(s)
                    </Typography>
                  ) : (
                    index === GROUP_ITEMS_TO_SHOW && (
                      <Link href="#" key={index}>
                        +{" "}
                        {Object.entries(groupedVessels).length -
                          GROUP_ITEMS_TO_SHOW}{" "}
                        more
                      </Link>
                    )
                  )
              )}
            </Stack>
          }
        </>
      ) : (
        <Typography variant="body1">{value?.name}</Typography>
      )}
    </Stack>
  );
};
