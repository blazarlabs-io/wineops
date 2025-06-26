import { DashboardEntity } from "@/models/types/dashboard";

export function useGrouping<T extends DashboardEntity>(data: T[]) {
  const groups = data
    .filter(
      ({ group, rowType }) =>
        !!group && (rowType === "group" || group.length > 1)
    )
    .map(({ group, rowType }) =>
      rowType === "group" ? group : group?.slice(0, -1)
    );

  const uniqueGroups = [
    ...new Set(
      groups.reduce((acc, group) => {
        const joinedGroups = group?.map((_: string, index: number) =>
          group.slice(0, index + 1).join(" > ")
        );

        return [...(acc as string[]), ...(joinedGroups as string[])];
      }, [])
    ),
  ].sort((a: unknown, b: unknown) => (a as string).localeCompare(b as string));

  return {
    uniqueGroups,
  };
}
