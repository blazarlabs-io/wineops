import VineyardGreenHarvestActionForm from "./vineyard-green-harvest-action-form";

export default function VineyardFertilizerApplicationActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardGreenHarvestActionForm onBackClick={onBackClick} />;
}
