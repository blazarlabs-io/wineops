import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { Grape } from "@/models/types/db";
import GrapeProcessingActionForm from "./grape-processing-action-form";
import { useVessel } from "@/context/vessel";

export default function GrapeProcessingActionFormComposer() {
  const { selectedGrapes, grapes, actions } = useGrape();
  const { vessels } = useVessel();
  const { labReports } = useVineyard();
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
