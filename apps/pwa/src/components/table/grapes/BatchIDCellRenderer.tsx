import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { FunctionComponent } from "react";
import React from "react";

export const BatchIDCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { value, data, node } = params;
  const isGroup = node.group || data?.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
      data-id={data?.id}
    >
      {isGroup ? (
        <>
          {node?.allChildrenCount}{" "}
          {node?.allChildrenCount === 1 ? "Batch" : "Batches"}
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
          <Box sx={{ mb: 0.5 }}>
            <CertificationsDataDisplay
              showOnlyActive
              certifications={data?.certifications || {}}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
