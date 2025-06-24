import GrapeForm from "@/components/forms/grape/grape-form";
import EntityFormDrawer from "../entity-form-drawer";

export default function GrapeFormDrawer() {
  return (
    <EntityFormDrawer entityName="grape">
      <GrapeForm />
    </EntityFormDrawer>
  );
}
