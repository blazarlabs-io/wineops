import EntityFormDrawer from "./entity-form-drawer";
import WineForm from "../forms/wine/wine-form";

export default function WineFormDrawer() {
  return (
    <EntityFormDrawer entityName="wine">
      <WineForm />
    </EntityFormDrawer>
  );
}
