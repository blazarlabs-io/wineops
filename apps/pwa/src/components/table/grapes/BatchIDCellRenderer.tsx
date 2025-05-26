import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { FunctionComponent } from "react";
import React from "react";

export const BatchIDCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const localData = Array.isArray(value) ? value[0] : {};

  console.log("BatchIDCellRenderer:value:", value);
  console.log("BatchIDCellRenderer:params:", params);

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {isGroup ||
      (value &&
        value?.length > 0 &&
        Array.isArray(value) &&
        Array.isArray(value[0])) ? (
        <>
          {value?.length} {value?.length === 1 ? "Batch" : "Batches"}
        </>
      ) : (
        <Stack
          gap={1}
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-start"
        >
          <Stack justifyContent="flex-end">
            <Typography>{localData?.name}</Typography>
            <Typography>{localData?.grapeVariety}</Typography>
          </Stack>
          {localData?.certifications && (
            <Box sx={{ mb: 0.5 }}>
              <CertificationsDataDisplay
                certifications={localData?.certifications}
              />
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
};
