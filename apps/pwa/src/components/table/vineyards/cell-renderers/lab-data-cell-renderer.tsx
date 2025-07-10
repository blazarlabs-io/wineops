/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CustomCellRendererProps } from "ag-grid-react";
import { useMemo, type FunctionComponent } from "react";

import LabReportSimpleDataDisplay from "@/components/data-display/lab-report-simple-data-display";
import { useVineyard } from "@/context/vineyard";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { LabReport } from "@/models/types/db";
import Stack from "@mui/material/Stack";

export const LabDataCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, data, node }) => {
  const { labReports } = useVineyard();

  const isGroup = node.group || data.rowType === "group";
  const labData = isGroup
    ? undefined
    : value || data?.labData || node.data?.labData;

  const descSortedLabData = labData
    ? labData.sort(
        (a: any, b: any) =>
          b.date.toDate().getTime() - a.date.toDate().getTime()
      )
    : [];

  const [mostRecentLabData, secondMostRecentLabData] = descSortedLabData;
  const mostRecentLab = useMemo(
    () =>
      labReports.find(({ id }) => id === mostRecentLabData?.id) ??
      ({} as LabReport),
    [labReports, mostRecentLabData?.id]
  );
  const secondMostRecentLab = useMemo(
    () =>
      labReports.find(({ id }) => id === secondMostRecentLabData?.id) ??
      ({} as LabReport),
    [labReports, secondMostRecentLabData?.id]
  );

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup && labReports && labData && (
        <LabReportSimpleDataDisplay
          data={mostRecentLab}
          prevData={secondMostRecentLab}
        />
      )}
    </Stack>
  );
};
