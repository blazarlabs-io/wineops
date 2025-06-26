import { DashboardEntity } from "@/models/types/dashboard";

const getUnusedGroups = (data: DashboardEntity[]) => {
  const leafGroupPaths = data
    .filter((item) => item.rowType !== "group" && Array.isArray(item.group))
    .map((item) => item.group?.join("|"));

  const groupOnlyRows = data.filter(
    (item) => item.rowType === "group" && Array.isArray(item.group)
  );

  const unusedGroups = groupOnlyRows.filter((groupRow) => {
    const groupPath = groupRow.group?.join("|");
    return !leafGroupPaths.some(
      (leafPath) =>
        leafPath?.startsWith(groupPath + "|") || leafPath === groupPath
    );
  });

  return unusedGroups;
};

export default getUnusedGroups;
