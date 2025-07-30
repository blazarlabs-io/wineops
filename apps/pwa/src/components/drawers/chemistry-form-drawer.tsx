import EntityFormDrawer from "./entity-form-drawer";
import ChemistryForm from "../forms/chemistry/chemistry-form";

export default function ChemistryFormDrawer() {
  return (
    <EntityFormDrawer entityName="chemistry">
      <ChemistryForm />
    </EntityFormDrawer>
  );
}
