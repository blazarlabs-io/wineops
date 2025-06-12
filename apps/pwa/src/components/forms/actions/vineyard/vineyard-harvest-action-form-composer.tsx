import { useVessel } from "@/context/vessel";
import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardHarvestActionForm from "./vineyard-harvest-action-form";

export default function VineyardHarvestActionFormComposer() {
  const { selectedVineyards, vineyards, actions, labReports } = useVineyard();
  const { vessels } = useVessel();
  return (
    <VineyardHarvestActionForm
      vessels={vessels}
      actions={actions}
      vineyards={vineyards as Vineyard[]}
      selectedVineyards={selectedVineyards as Vineyard[]}
      labReports={labReports}
    />
  );
}
