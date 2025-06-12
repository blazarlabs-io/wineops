import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { Grape } from "@/models/types/db";
import GrapeProcessingActionForm from "./grape-processing-action-form";

export default function GrapeProcessingActionFormComposer() {
  const { selectedGrapes, grapes, actions } = useGrape();
  const { labReports } = useVineyard();
  return (
    <GrapeProcessingActionForm
      actions={actions}
      grapes={grapes as Grape[]}
      selectedGrapes={selectedGrapes as Grape[]}
      labReports={labReports}
    />
  );
}
