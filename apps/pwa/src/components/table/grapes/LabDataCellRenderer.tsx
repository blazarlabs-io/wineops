import LabItem from "@/components/data-display/lab-item";
import formatDate from "@/utils/date-format";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const LabDataCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const localData = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {isGroup || (value && Array.isArray(value) && Array.isArray(value[0])) ? (
        <></>
      ) : (
        localData && (
          <Stack>
            {localData?.date && (
              <Typography variant="caption" color="textDisabled">
                {formatDate(localData?.date, { locale: "ro-RO" })}
              </Typography>
            )}

            <Stack gap={1} direction="row">
              <LabItem
                variant="small"
                label="Sugar"
                data={localData?.sugar ?? { value: "N/A" }}
              />
              <LabItem
                variant="small"
                label="Acidity"
                data={localData?.acidity ?? { value: "N/A" }}
              />
            </Stack>
          </Stack>
        )
      )}
    </Stack>
  );
};
{
  /*<LabSimpleDataDisplay data={data} />*/
}
