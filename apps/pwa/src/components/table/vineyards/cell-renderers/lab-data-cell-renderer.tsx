import type { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, type FunctionComponent } from "react";

import LabReportSimpleDataDisplay from "@/components/data-display/lab-report-simple-data-display";
import { useVineyard } from "@/context/vineyard";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useGetVineyardLabData } from "@/hooks/use-get-vineyard-lab-data";
import { LabReport } from "@/models/types/db";
import { Box } from "@mui/material";

export const LabDataCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { labReports, vineyards } = useVineyard();
  const { labData } = useGetVineyardLabData(
    params.node.data.name,
    params.node.data.labData,
    labReports,
    vineyards
  );
  // const [labData, setLabData] = useState<LabReport | null>(null);

  useEffect(() => {
    // * Get the lab report (from laReports array) that matches the labData
    if (
      labReports &&
      labReports.length > 0 &&
      params.node.data.labData &&
      params.node.data.labData.length > 0
    ) {
      const labRes = labReports.filter(
        (r: LabReport) =>
          r.id ===
          params.node.data.labData.filter((l: LabReport) => l?.id === r?.id)[0]
            ?.id
      );

      // setLabData(labRes[labRes.length - 1]);
    }
  }, [labReports]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params.node.group && labReports && labData && (
        <LabReportSimpleDataDisplay
          data={labData[labData.length - 1] as LabReport}
        />
      )}
    </Box>
  );
};
