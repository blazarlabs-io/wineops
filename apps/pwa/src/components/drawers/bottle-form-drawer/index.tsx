import BottleWineForm from "@/components/forms/bottle/bottle-wine-form";
import EntityFormDrawer from "../entity-form-drawer";

export default function BottleFormDrawer() {
  return (
    <EntityFormDrawer entityName="bottle">
      <BottleWineForm />
    </EntityFormDrawer>
  );
}
