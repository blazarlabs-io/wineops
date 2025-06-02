import LabItem from "@/components/data-display/lab-item";
import { DEFAULT_LOCALE } from "@/data/constants";
import formatDate from "@/utils/date-format";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const LabDataCellRenderer = ({ value }: CustomCellRendererProps) => {
  const data = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {value && Array.isArray(value) && Array.isArray(value[0]) ? (
        <></>
      ) : (
        data && (
          <Stack>
            {data?.date && (
              <Typography variant="caption" color="textDisabled">
                {formatDate(data?.date, { locale: DEFAULT_LOCALE })}
              </Typography>
            )}

            <Stack gap={1} direction="row">
              <LabItem
                variant="small"
                label="Sugar"
                data={data?.sugar ?? { value: "N/A" }}
              />
              <LabItem
                variant="small"
                label="Acidity"
                data={data?.acidity ?? { value: "N/A" }}
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
