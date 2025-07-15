import VineyardSoilMonitoringActionForm from "./vineyard-soil-monitoring-action-form";

export default function VineyardSoilMonitoringActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <VineyardSoilMonitoringActionForm onBackClick={onBackClick} />;
}
