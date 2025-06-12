import { useGrape } from "@/context/grape";
import { Grape } from "@/models/types/db";
import GrapeIntakeActionForm from "./grape-intake-action-form";
import { useVineyard } from "@/context/vineyard";

export default function GrapeIntakeActionFormComposer() {
  const { selectedGrapes, grapes, actions } = useGrape();
  const { labReports } = useVineyard();
  return (
    <GrapeIntakeActionForm
      actions={actions}
      grapes={grapes as Grape[]}
      selectedGrapes={selectedGrapes as Grape[]}
      labReports={labReports}
    />
  );
}
