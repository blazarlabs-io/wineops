import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { FunctionComponent } from "react";
import React from "react";

export const BatchIDCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => {
  const data = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {value && Array.isArray(value) && Array.isArray(value[0]) ? (
        <>
          {value.length} {value.length === 1 ? "Batch" : "Batches"}
        </>
      ) : (
        <Stack
          gap={1}
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-start"
        >
          <Stack justifyContent="flex-end">
            <Typography>{data?.name}</Typography>
            <Typography>{data?.grapeVariety}</Typography>
          </Stack>
          {data?.certifications && (
            <Box sx={{ mb: 0.5 }}>
              <CertificationsDataDisplay
                certifications={data?.certifications}
              />
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
};
