import VineyardIrrigationActionForm from "./vineyard-irrigation-action-form";

export default function VineyardIrrigationActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardIrrigationActionForm onBackClick={onBackClick} />;
}
