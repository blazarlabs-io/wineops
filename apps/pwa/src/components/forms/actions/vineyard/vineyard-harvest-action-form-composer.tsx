import { useVessel } from "@/context/vessel";
import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardHarvestActionForm from "./vineyard-harvest-action-form";
import { useSelectedEntitiesStore } from "@/store/selected-entities";

export default function VineyardHarvestActionFormComposer() {
  const { vineyards, actions, labReports } = useVineyard();
  const { vessels } = useVessel();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  );

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
