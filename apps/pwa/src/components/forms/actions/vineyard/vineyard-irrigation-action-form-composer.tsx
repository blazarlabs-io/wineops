import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardIrrigationActionForm from "./vineyard-irrigation-action-form";
import { useSelectedEntitiesStore } from "@/store/selected-entities";

export default function VineyardIrrigationActionFormComposer() {
  const { vineyards, actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  );

  return (
    <VineyardIrrigationActionForm
      actions={actions}
      vineyards={vineyards as Vineyard[]}
      selectedVineyards={selectedVineyards as Vineyard[]}
    />
  );
}
