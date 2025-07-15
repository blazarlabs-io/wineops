import VineyardFertilizerApplicationActionForm from "./vineyard-fertilizer-application-form";

export default function VineyardFertilizerApplicationActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardFertilizerApplicationActionForm onBackClick={onBackClick} />;
}
