import GrapeProcessingActionForm from "./grape-processing-action-form";

export default function GrapeProcessingActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <GrapeProcessingActionForm onBackClick={onBackClick} />;
}
