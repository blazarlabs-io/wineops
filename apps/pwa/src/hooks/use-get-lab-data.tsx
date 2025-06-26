import { ActionRelation } from "@/models/types/actions";
import { DashboardEntity } from "@/models/types/dashboard";
import { LabReport } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetLabData = (
  id: string,
  entityLabData: ActionRelation[],
  labReports: LabReport[],
  entities: DashboardEntity[]
) => {
  const [labData, setLabData] = useState<LabReport[] | null>(null);

  useEffect(() => {
    if (
      labReports &&
      labReports.length > 0 &&
      entityLabData &&
      entityLabData.length > 0 &&
      entities &&
      entities.length > 0 &&
      id
    ) {
      const entity = entities.filter((v) => v.name === id)[0];

      const labRes = labReports.filter(
        (r: LabReport) =>
          r.id ===
          (entity?.labData
            ? Array.isArray(entity?.labData)
              ? (entity?.labData as unknown as LabReport[]).find(
                  (l) => l.id === r.id
                )?.id
              : (entity?.labData as unknown as LabReport).id
            : null)
      );

      setLabData(labRes);
    }
  }, [labReports, entityLabData, id, entities]);

  return { labData };
};
