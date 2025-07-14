import VineyardPestInspectionActionForm from "./vineyard-pest-inspection-action-form";

export default function VineyardPestInspectionActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardPestInspectionActionForm onBackClick={onBackClick} />;
}
