import EntityFormDrawer from "./entity-form-drawer";
import ConsumableForm from "../forms/consumable/consumable-form";

export default function ConsumableFormDrawer() {
  return (
    <EntityFormDrawer entityName="consumable">
      <ConsumableForm />
    </EntityFormDrawer>
  );
}
