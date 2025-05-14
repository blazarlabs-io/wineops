import { Vineyard } from "@/models/types/db";
import { SetStateAction, useCallback, useState } from "react";

export function useGrouping<T extends Vineyard>(data: T[]) {
  const [groupedData, _setGroupedData] = useState<T[]>(data);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [groupToExpand, setGroupToExpand] = useState<string[]>([]);

  const groups = groupedData
    .filter(({ group }) => !!group && group.length > 1)
    .map(({ group }) => group.slice(0, -1));

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

  const addRowToGroup = (group: string[]) => {
    if (selectedRows.length === 0 || group.length === 0) {
      return;
    }

    setGroupToExpand(group);

    const rowIds: string[] = selectedRows.map(({ id }) => id);

    _setGroupedData((prev) =>
      prev.map((row) =>
        rowIds.includes(row.id) ? { ...row, group: [...group, row.name] } : row
      )
    );
  };

  const ungroupRow = () => {
    if (selectedRows.length === 0) {
      return;
    }

    const rowIds: string[] = selectedRows.map(({ id }) => id);

    _setGroupedData((prev) =>
      prev.map((row) =>
        rowIds.includes(row.id) ? { ...row, group: [row.id ?? row.name] } : row
      )
    );
  };

  const setGroupedData = useCallback(
    (data: SetStateAction<T[]>) => _setGroupedData(data),
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
