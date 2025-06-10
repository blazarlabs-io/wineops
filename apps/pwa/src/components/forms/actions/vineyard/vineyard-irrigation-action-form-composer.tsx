import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import VineyardIrrigationActionForm from "./vineyard-irrigation-action-form";

export default function VineyardIrrigationActionFormComposer() {
  const { selectedVineyards, vineyards, actions } = useVineyard();
  return (
    <VineyardIrrigationActionForm
      actions={actions}
      vineyards={vineyards as Vineyard[]}
      selectedVineyards={selectedVineyards as Vineyard[]}
    />
  );
}
