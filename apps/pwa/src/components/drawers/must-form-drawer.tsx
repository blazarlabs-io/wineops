import EntityFormDrawer from "./entity-form-drawer";
import MustForm from "../forms/must/must-form";

export default function MustFormDrawer() {
  return (
    <EntityFormDrawer entityName="must">
      <MustForm />
    </EntityFormDrawer>
  );
}
