//import { ENTITY_DETAILS } from "@/data/constants";
import { DashboardEntity } from "@/models/types/dashboard";
import { SetStateAction, useCallback, useState } from "react";

export function useGrouping<T extends DashboardEntity>(
  data: T[],
  entryKey?: keyof T
) {
  const [groupedData, _setGroupedData] = useState<T[]>(data || []);
  const [selectedRows, _setSelectedRows] = useState<T[]>([]);
  const [groupToExpand, setGroupToExpand] = useState<string[]>([]);

  const groups = groupedData
    .filter(
      ({ group, rowType }) =>
        !!group && (rowType === "group" || group.length > 1)
    )
    .map(({ group, rowType }) =>
      rowType === "group"
        ? group
        : group.slice(
            0,
            /*group[group.length - 1] === ENTITY_DETAILS ? -2 : */ -1
          )
    );

  const uniqueGroups = [
    ...new Set(
      groups.reduce((acc, group) => {
        const joinedGroups = group.map((_, index) =>
          group.slice(0, index + 1).join(" > ")
        );

        return [...acc, ...joinedGroups];
      }, [])
    ),
  ].sort((a, b) => a.localeCompare(b));

  console.log("GROUPS", groupedData);

  const addRowToGroup = (group: string[]) => {
    if (selectedRows.length === 0 || group.length === 0) {
      return;
    }

    setGroupToExpand(group);

    const rowIds: string[] = selectedRows.map(({ id }) => id);

    _setGroupedData((prev) =>
      prev.map((row) =>
        rowIds.includes(row.id)
          ? { ...row, group: [...group, row[entryKey ?? ("name" as keyof T)]] }
          : row
      )
    );
  };

  // const ungroupRow = () => {
  //   if (selectedRows.length === 0) {
  //     return;
  //   }

  //   const rowIds: string[] = selectedRows.map(({ id }) => id);

  //   _setGroupedData((prev) =>
  //     prev.map((row) =>
  //       rowIds.includes(row.id) ? { ...row, group: [row.id ?? row.name] } : row
  //     )
  //   );
  // };

  const ungroupRow = () => {
    if (selectedRows.length === 0) return;

    const groupNamesToUngroup = selectedRows.map(({ id }) => id);

    _setGroupedData((prev) =>
      prev.map((row) => {
        if (!row.group || !Array.isArray(row.group)) return row;

        const groupIndex = row.group.findIndex((g) =>
          groupNamesToUngroup.includes(g)
        );

        // Only ungroup if the group is not the last element (i.e., not a leaf item)
        if (groupIndex >= 0 && groupIndex < row.group.length - 1) {
          const newGroup = [
            ...row.group.slice(0, groupIndex),
            ...row.group.slice(groupIndex + 1),
          ];
          return { ...row, group: newGroup };
        }

        return row;
      })
    );
  };

  const setGroupedData = useCallback(
    (data: SetStateAction<T[]>) => _setGroupedData(data),
    []
  );

  const setSelectedRows = useCallback(
    (data: SetStateAction<T[]>) => _setSelectedRows(data),
    []
  );

  return {
    groupToExpand,
    groupedData,
    setGroupedData,
    setGroupToExpand,
    addRowToGroup,
    ungroupRow,
    uniqueGroups,
    selectedRows,
    setSelectedRows,
  };
}
