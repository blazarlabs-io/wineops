import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardLabActionForm from "./vineyard-lab-action-form";

export default function VineyardLabActionFormComposer() {
  const { selectedVineyards, vineyards, actions } = useVineyard();
  return (
    <VineyardLabActionForm
      actions={actions}
      vineyards={vineyards as Vineyard[]}
      selectedVineyards={selectedVineyards as Vineyard[]}
    />
  );
}
