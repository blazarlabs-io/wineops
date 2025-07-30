import LabItem from "@/components/data-display/lab-item";
import LabReportSimpleDataDisplay from "@/components/data-display/lab-report-simple-data-display";
import { DEFAULT_LOCALE, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { LabReport } from "@/models/types/db";
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
            <LabReportSimpleDataDisplay
              data={
                {
                  id: "",
                  date: value?.date,
                  units: "g/dm³",
                  results: {
                    sugar: {
                      value: value?.sugar?.value || "",
                      variation: value?.sugar?.variation || "",
                    },
                    acidity: {
                      value: value?.acidity?.value || "",
                      variation: value?.acidity?.variation || "",
                    },
                  },
                } as unknown as LabReport
              }
            />
          </Stack>
        )
      )}
    </Stack>
  );
};
