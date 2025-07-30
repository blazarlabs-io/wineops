import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";
import TotalQuantityPieWidget from "../widgets/total-quantity/total-qty-pie";
import { formatNumberWithLowerCaseUnitAndSpace } from "@/utils/number-format";
import Typography from "@mui/material/Typography";
import LabReportSimpleDataDisplay from "../data-display/lab-report-simple-data-display";
import { LabReport } from "@/models/types/db";

export const QuantityCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const metrics = (node?.allLeafChildren || []).map(
    ({ data }) => data?.metrics,
  );

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <Stack height="100%" alignItems="flex-start" justifyContent="center">
          <TotalQuantityPieWidget metrics={metrics} width={80} height={80} />
        </Stack>
      ) : (
        <Stack gap={1}>
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography variant="body2">Net Weight:</Typography>

            <Typography variant="body1">
              {value?.entry?.netWeight
                ? formatNumberWithLowerCaseUnitAndSpace(
                    value?.entry?.netWeight,
                    value?.entry?.netUnit || "kg",
                  )
                : "N/A"}
            </Typography>
          </Stack>

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
      )}
    </Stack>
  );
};
