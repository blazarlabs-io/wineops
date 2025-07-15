import VineyardGreenHarvestActionForm from "./vineyard-green-harvest-action-form";

export default function VineyardGreenHarvestActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardGreenHarvestActionForm onBackClick={onBackClick} />;
}
