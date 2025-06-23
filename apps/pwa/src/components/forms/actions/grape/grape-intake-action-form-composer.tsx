import { useGrape } from "@/context/grape";
import { Grape } from "@/models/types/db";
import GrapeIntakeActionForm from "./grape-intake-action-form";
import { useVineyard } from "@/context/vineyard";
import { useSelectedEntitiesStore } from "@/store/selected-entities";

export default function GrapeIntakeActionFormComposer() {
  const { grapes, actions } = useGrape();
  const { labReports } = useVineyard();

  const selectedGrapes = useSelectedEntitiesStore(({ selected }) => selected);

  return (
    <GrapeIntakeActionForm
      actions={actions}
      grapes={grapes as Grape[]}
      selectedGrapes={selectedGrapes as Grape[]}
      labReports={labReports}
    />
  );
}
