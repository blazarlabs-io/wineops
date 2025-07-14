import VineyardVinePruningActionForm from "./vineyard-vine-pruning-action-form";

export default function VinePruningActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardVinePruningActionForm onBackClick={onBackClick} />;
}
