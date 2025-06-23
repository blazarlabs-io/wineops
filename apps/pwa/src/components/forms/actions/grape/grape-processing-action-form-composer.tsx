import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { Grape } from "@/models/types/db";
import GrapeProcessingActionForm from "./grape-processing-action-form";
import { useVessel } from "@/context/vessel";
import { useSelectedEntitiesStore } from "@/store/selected-entities";

export default function GrapeProcessingActionFormComposer() {
  const { grapes, actions } = useGrape();
  const { vessels } = useVessel();
  const { labReports } = useVineyard();

  const selectedGrapes = useSelectedEntitiesStore(({ selected }) => selected);

  return (
    <GrapeProcessingActionForm
      actions={actions}
      grapes={grapes as Grape[]}
      selectedGrapes={selectedGrapes as Grape[]}
      labReports={labReports}
      vessels={vessels}
    />
  );
}
