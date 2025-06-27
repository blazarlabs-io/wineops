import VineyardHarvestActionForm from "./vineyard-harvest-action-form";

export default function VineyardHarvestActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardHarvestActionForm onBackClick={onBackClick} />;
}
