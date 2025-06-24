import VesselForm from "@/components/forms/vessel/vessel-form";
import EntityFormDrawer from "../entity-form-drawer";

export default function VesselFormDrawer() {
  return (
    <EntityFormDrawer entityName="vessel">
      <VesselForm />
    </EntityFormDrawer>
  );
}
