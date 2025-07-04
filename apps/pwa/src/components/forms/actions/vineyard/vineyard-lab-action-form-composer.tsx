import VineyardLabActionForm from "./vineyard-lab-action-form";

export default function VineyardLabActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardLabActionForm onBackClick={onBackClick} />;
}
