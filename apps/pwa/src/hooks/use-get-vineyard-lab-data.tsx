import { ActionRelation } from "@/models/types/actions";
import { LabReport, Vineyard } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetVineyardLabData = (
  id: string,
  vineyardLabData: ActionRelation[],
  labReports: LabReport[],
  vineyards: Vineyard[]
) => {
  const [labData, setLabData] = useState<LabReport[] | null>(null);

  useEffect(() => {
    if (
      labReports &&
      labReports.length > 0 &&
      vineyardLabData &&
      vineyardLabData.length > 0 &&
      vineyards &&
      vineyards.length > 0 &&
      id
    ) {
      const vineyard = vineyards.filter((v) => v.name === id)[0];

      const labRes = labReports.filter(
        (r: LabReport) =>
          r.id ===
          vineyard?.labData?.filter((l: ActionRelation) => l?.id === r?.id)[0]
            ?.id
      );

      setLabData(labRes);
    }
  }, [labReports, vineyardLabData, id, vineyards]);

  return { labData };
};
