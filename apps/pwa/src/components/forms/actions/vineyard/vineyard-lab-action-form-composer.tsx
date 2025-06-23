import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardLabActionForm from "./vineyard-lab-action-form";
import { useSelectedEntitiesStore } from "@/store/selected-entities";

export default function VineyardLabActionFormComposer() {
  const { vineyards, actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  );

  return (
    <VineyardLabActionForm
      actions={actions}
      vineyards={vineyards as Vineyard[]}
      selectedVineyards={selectedVineyards as Vineyard[]}
    />
  );
}
