import GrapeIntakeActionForm from "./grape-intake-action-form";

export default function GrapeIntakeActionFormComposer({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  return <GrapeIntakeActionForm onBackClick={onBackClick} />;
}
