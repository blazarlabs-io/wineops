import { ActionRelation } from "@/models/types/actions";
import { LabReport } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetLabData = (
  entityLabData: ActionRelation[],
  labReports: LabReport[],
) => {
  const [labData, setLabData] = useState<LabReport[] | null>(null);

  useEffect(() => {
    if (labReports?.length > 0 && entityLabData?.length > 0) {
      const labRes = labReports.filter(
        (r: LabReport) =>
          r.id ===
          (entityLabData
            ? Array.isArray(entityLabData)
              ? (entityLabData as unknown as LabReport[]).find(
                  (l) => l.id === r.id,
                )?.id
              : (entityLabData as unknown as LabReport).id
            : null),
      );

      setLabData(labRes);
    }
  }, [labReports, entityLabData]);

  return { labData };
};
