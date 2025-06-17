import LabItem from "@/components/data-display/lab-item";
import { DEFAULT_LOCALE, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import formatDate from "@/utils/date-format";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const LabDataCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <></>
      ) : (
        value && (
          <Stack>
            {value?.date && (
              <Typography variant="caption" color="textDisabled">
                {formatDate(value?.date, { locale: DEFAULT_LOCALE })}
              </Typography>
            )}

            <Stack gap={1} direction="row">
              <LabItem
                variant="small"
                label="Alcohol"
                data={value?.alcohol ?? { value: "N/A" }}
              />
              <LabItem
                variant="small"
                label="Sugar"
                data={value?.sugar ?? { value: "N/A" }}
              />
              <LabItem
                variant="small"
                label="Acidity"
                data={value?.acidity ?? { value: "N/A" }}
              />
            </Stack>
          </Stack>
        )
      )}
    </Stack>
  );
};
