import VineyardWeedRemovalActionForm from "./vineyard-weed-removal-action-form";

export default function VineyardWeedRemovalActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardWeedRemovalActionForm onBackClick={onBackClick} />;
}
