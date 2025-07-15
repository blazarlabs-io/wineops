import VineyardPesticideApplicationActionForm from "./vineyard-pesticide-application-action-form";

export default function VineyardPestInspectionActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardPesticideApplicationActionForm onBackClick={onBackClick} />;
}
