import TeamMemberCreateEditForm from "@/components/forms/team/team-member-create-edit-form";
import EntityFormDrawer from "../entity-form-drawer";

export default function TeamMemberFormDrawer() {
  return (
    <EntityFormDrawer entityName="team">
      <TeamMemberCreateEditForm />
    </EntityFormDrawer>
  );
}
