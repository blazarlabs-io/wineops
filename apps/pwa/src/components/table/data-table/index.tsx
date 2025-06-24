/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { DashboardEntity } from "@/models/types/dashboard";
import { DbResponse, EntityName } from "@/models/types/db";
import { nodesToEntities } from "@/utils/notes-to-entities";
import { Button, Stack, Typography, useColorScheme } from "@mui/material";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ExcelExportModule,
  GetDataPath,
  GetRowIdFunc,
  GridApi,
  IRowNode,
  IsGroupOpenByDefaultParams,
  MasterDetailModule,
  ModuleRegistry,
  RefreshCellsParams,
  RichSelectModule,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  RowGroupingModule,
  RowSelectionOptions,
  SelectionChangedEvent,
  SetFilterModule,
  StatusBarModule,
  themeBalham,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shiftGroups } from "../utils";
import "./style.css";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import getUnusedGroups from "@/utils/get-unused-groups";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  MasterDetailModule,
  RowGroupingModule,
  RichSelectModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
  RowDragModule,
]);

interface DataTableProps<T extends DashboardEntity> {
  gridTheme?: string;
  data?: T[];
  entryKey?: keyof T;
  columns: ColDef[];
  groupColumnDef?: ColDef<any, any>;
  groupByButtons?: any[];
  getRowId?: GetRowIdFunc<any> | undefined;
  entityName?: EntityName;
}

export const DataTable = <T extends DashboardEntity>({
  gridTheme = "ag-theme-quartz",
  data = [],
  columns,
  groupColumnDef,
  groupByButtons,
  getRowId,
  entityName,
}: DataTableProps<T>) => {
  const { mode } = useColorScheme();
  const isDarkMode = mode === "dark";

  const { enqueueSnackbar } = useSnackbar();

  // * Main Data Grid Ref
  const gridRef = useRef<AgGridReact>(null);

  // * Column Definitions
  const colDefs = useMemo(() => columns, [columns]);

  // * Row Data
  const [rowData, setRowData] = useState<T[]>(data);
  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT);
  const [potentialParent, setPotentialParent] = useState<any>(null);

  // * Get Data Path ["group", "item name"]
  const getDataPath = useCallback<GetDataPath>((data) => {
    return data.group;
  }, []);

  // * Theming
  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const myTheme = themeBalham
    .withParams({
      fontFamily: "lato",
      headerFontFamily: "Lato",
      cellFontFamily: "Lato",
      fontSize: "14px",
      headerFontSize: "14px",
      headerFontWeight: "600",
      headerRowBorder: true,
      wrapperBorderRadius: "8px",
      rowHeight: rowHeight,
    })
    .withParams(
      {
        backgroundColor: "#121212",
        foregroundColor: "#FFFFFFCC",
        browserColorScheme: "dark",
      },
      "dark"
    )
    .withParams(
      {
        backgroundColor: "#FFFFFFCC",
        foregroundColor: "#361008CC",
        browserColorScheme: "light",
      },
      "light"
    );

  // * Define the auto-group column
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return { ...groupColumnDef };
  }, [groupColumnDef]);

  // * Row Selection Options
  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
      checkboxLocation: "autoGroupColumn",
    };
  }, []);

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  const setSelected = useSelectedEntitiesStore((state) => state.setSelected);

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      // * Selected items in an array format, Only list of items grouping is ignored
      const entities = nodesToEntities<T>(selectedNodes);
      setSelected(entities, entityName);
    },
    [entityName, setSelected]
  );

  const { user } = useAuth();
  const uid = user?.uid || "";

  const createNewGroup = (group: string[]) => {
    if (!group || !data || group.length === 0 || data.length === 0) return;

    const existingGroup = !!data.find(
      (row) =>
        row?.group &&
        Array.isArray(row.group) &&
        row.rowType === "group" &&
        row.group.length === group.length &&
        row.group.every((val: any, i: any) => val === group[i])
    );

    if (existingGroup) return;

    return {
      id: crypto.randomUUID(),
      rowType: "group",
      group,
    };
  };

  const updateRowsGroup = async (selectedRows: T[], group: string[] = []) => {
    if (!entityName || !db[entityName] || !uid || selectedRows.length === 0)
      return;

    const isGrouping = group.length > 0;

    setGroupToExpand(group);

    const newGroup = createNewGroup(group);

    const newGroups = newGroup?.group ? [newGroup] : [];

    const fullySelectedGroups = getFullySelectedGroups(selectedRows, data);

    const updatedRows = selectedRows.map((row) => {
      const groupPrefix = newGroup?.group ?? group;
      const foundGroupIndex = row?.group.findIndex((item) =>
        fullySelectedGroups.includes(item)
      );

      const hierarchyGroup =
        foundGroupIndex > -1
          ? [...groupPrefix, ...row?.group.slice(foundGroupIndex, -1)]
          : groupPrefix;

      const newHierarchyGroup = createNewGroup(hierarchyGroup);

      if (newHierarchyGroup && newHierarchyGroup?.group?.length > 0) {
        if (
          !newGroups.find(
            (newGroup) =>
              newGroup.group.join(",") === newHierarchyGroup.group.join(",")
          )
        ) {
          newGroups.push(newHierarchyGroup);
        }
      }

      return {
        id: row.id,
        rowType: row.rowType,
        group:
          group.length > 0
            ? row.rowType === "group"
              ? groupPrefix
              : [...(newHierarchyGroup?.group ?? hierarchyGroup), row.name]
            : row.rowType === "group"
              ? [...row.group.slice(0, -2), row.group[row.group.length - 1]]
              : [...row.group.slice(0, -2), row.name],
      };
    });

    const updatedMap = new Map(updatedRows.map((row) => [row.id, row]));

    const allRows = rowData.map(
      (row) => (updatedMap.has(row.id) ? updatedMap.get(row.id) : row) as T
    );

    const unusedGroups = getUnusedGroups(allRows);

    const unusedGroupsIds = unusedGroups.map(({ id }) => id);

    const updatedRowsWithUnused = [
      ...unusedGroups.map((row) => ({ ...row, group: [] })),
      ...updatedRows.filter(({ id }) => !unusedGroupsIds.includes(id)),
    ];

    setSelected([]);
    gridRef.current?.api?.deselectAll();

    const updateRes: DbResponse = await db[entityName].updateGroup(
      uid,
      newGroups.length > 0
        ? [...updatedRowsWithUnused, ...newGroups]
        : updatedRowsWithUnused
    );

    if (updateRes.status === 200) {
      enqueueSnackbar(`${isGrouping ? "Grouped" : "Ungrouped"} successfully.`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Failed to ${isGrouping ? "group" : "ungroup"}.`, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (groupColumnDef) {
      groupColumnDef.cellClassRules = {
        "hover-over": (params) => {
          return params.node === potentialParent;
        },
      };
    }
  }, [groupColumnDef]);

  useEffect(() => {
    setRowData(data);
  }, [data]);

  const [groupToExpand, setGroupToExpand] = useState<string[]>([]);

  const isGroupOpenByDefault = useCallback(
    (params: IsGroupOpenByDefaultParams) => {
      const route = params.rowNode.getRoute();
      return !!route?.every((item, idx) => groupToExpand[idx] === item);
    },
    [groupToExpand]
  );

  const setPotentialParentForNode = useCallback(
    (api: GridApi<T>, overNode: IRowNode<T> | undefined | null) => {
      let newPotentialParent: IRowNode<T> | null = null;
      if (overNode) {
        if (overNode.data?.rowType === "group") {
          // over a group, we take the immediate row
          newPotentialParent = overNode;
        } else if (overNode.parent) {
          // over a item, we take the parent row (which will be a group)
          newPotentialParent = overNode.parent;
        }
      }
      const alreadySelected = potentialParent === newPotentialParent;
      if (alreadySelected) {
        return; // no change
      }
      // we refresh the previous selection (if it exists) to clear
      // the highlighted and then the new selection.
      const rowsToRefresh = [];
      if (potentialParent) {
        rowsToRefresh.push(potentialParent);
      }
      if (newPotentialParent) {
        rowsToRefresh.push(newPotentialParent);
      }
      setPotentialParent(newPotentialParent);
      refreshRows(api, rowsToRefresh);
    },
    [potentialParent]
  );

  function refreshRows(api: GridApi, rowsToRefresh: IRowNode<T>[]) {
    const params: RefreshCellsParams<T> = {
      // refresh these rows only.
      rowNodes: rowsToRefresh,
      // because the grid does change detection, the refresh
      // will not happen because the underlying value has not
      // changed. to get around this, we force the refresh,
      // which skips change detection.
      force: true,
    };
    api.refreshCells(params);
  }

  // * DRAGGING EVENTS
  const onRowDragMove = useCallback(
    (event: RowDragMoveEvent) => {
      setPotentialParentForNode(event.api, event.overNode);
    },
    [setPotentialParentForNode]
  );

  const onRowDragLeave = useCallback(
    (event: RowDragLeaveEvent) => {
      setPotentialParentForNode(event.api, null);
    },
    [setPotentialParentForNode]
  );

  const onRowDragEnd = useCallback(
    async (event: RowDragEndEvent) => {
      const target = event.overNode?.data;
      if (!potentialParent && target) {
        return; // no move
      }
      const source = event.node.data;
      const rowData = event.api.getGridOption("rowData");

      if (rowData && source && source !== target) {
        const newRowData = shiftGroups<T>(rowData, source, target);
        if (!newRowData) {
          console.log("invalid move");
        } else if (newRowData !== rowData) {
          if (!entityName || !db[entityName]) return;

          console.log("onRowDragEnd, modifying grid row data");
          event.api.setGridOption("rowData", newRowData);
          console.log("newRowData:", newRowData);

          const unusedGroupsIds = getUnusedGroups(newRowData).map(
            ({ id }) => id
          );

          const updatedNewRowData = newRowData.map((row) => ({
            ...row,
            group: unusedGroupsIds.includes(row.id) ? [] : row.group,
          }));

          setSelected([]);
          gridRef.current?.api?.deselectAll();

          if (target?.group) {
            setGroupToExpand(target.group);
          }

          await db[entityName].updateGroup(uid, updatedNewRowData);

          enqueueSnackbar("Saved changes", { variant: "success" });
        }
        gridRef.current!.api.clearFocusedCell();
      }
      // clear node to highlight
      setPotentialParentForNode(event.api, null);
    },
    [
      enqueueSnackbar,
      entityName,
      potentialParent,
      setPotentialParentForNode,
      setSelected,
      uid,
    ]
  );

  const treeData = gridRef.current?.api?.getGridOption("treeData");

  type GroupBy =
    | "groupByDate"
    | "groupByVariety"
    | "groupByStatus"
    | "groupByVesselType"
    | "groupByLocation"
    | "type";

  const [groupedField, setGroupedField] = useState<GroupBy>();

  const handleGroupBy = (field: GroupBy) => {
    const api = gridRef.current?.api;

    if (!api) return;

    const isAlreadyGrouped = groupedField === field;

    if (isAlreadyGrouped) {
      api.setRowGroupColumns([]);
      api.updateGridOptions({ treeData: true });
      setGroupedField(undefined);
    } else {
      api.setRowGroupColumns([field]);
      api.updateGridOptions({ treeData: false });
      setGroupedField(field);
    }

    const allCols = api.getColumns() || [];

    const columnsToToggleVisibility = allCols.filter(
      (col) => col?.getColDef()?.headerName === autoGroupColumnDef?.headerName
    );

    if (columnsToToggleVisibility.length > 0) {
      api.setColumnsVisible(columnsToToggleVisibility, !isAlreadyGrouped);
    }

    api.setColumnsVisible(
      ["vesselId"],
      (isAlreadyGrouped &&
        ["groupByVesselType", "groupByLocation"].includes(
          groupedField || ""
        )) ||
        !["groupByVesselType", "groupByLocation"].includes(field)
    );

    api.setColumnsVisible(
      ["statusData"],
      groupedField === "groupByStatus" || field !== "groupByStatus"
    );
  };

  const filteredData = rowData?.filter(
    ({ rowType }) => rowType === "item" || rowType !== "group"
  );

  return (
    <>
      {groupByButtons && groupByButtons.length > 0 && (
        <Stack gap={2} direction="row">
          {groupByButtons?.map(({ name, columnName }) => (
            <Button
              key={columnName}
              autoFocus
              size="small"
              variant={groupedField === columnName ? "contained" : "outlined"}
              id={columnName}
              name={columnName}
              onClick={() => handleGroupBy(columnName)}
            >
              {groupedField === columnName ? `Unpivot ` : `Pivot by `}
              {name}
            </Button>
          ))}
        </Stack>
      )}

      <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
        {filteredData?.length > 0 ? (
          <AgGridReact
            theme={myTheme}
            ref={gridRef}
            columnDefs={colDefs}
            rowData={treeData ? rowData : filteredData}
            getDataPath={getDataPath}
            treeData
            autoGroupColumnDef={{
              ...autoGroupColumnDef,
              cellClassRules: {
                ...autoGroupColumnDef.cellClassRules,
                "hover-over": (params) => {
                  return params.node === potentialParent;
                },
              },
              headerName:
                groupByButtons?.find(
                  ({ columnName }) => columnName === groupedField
                )?.name || autoGroupColumnDef.headerName,
            }}
            rowSelection={rowSelection}
            onSelectionChanged={handleOnSelectionChanged}
            containerStyle={{ height: "100%", width: "100%" }}
            isGroupOpenByDefault={isGroupOpenByDefault}
            onRowDragMove={onRowDragMove}
            onRowDragLeave={onRowDragLeave}
            onRowDragEnd={onRowDragEnd}
            getRowId={getRowId ?? (({ data }) => data.id)}
            suppressRowHoverHighlight={true}
            suppressCellFocus={true}
            suppressGroupChangesColumnVisibility={
              groupedField?.includes("groupBy") ? true : false
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Typography color="textSecondary" className="">
              Nothing to show.
            </Typography>
          </div>
        )}
      </div>

      <GroupingDialog<T> onAddToGroup={updateRowsGroup} data={rowData} />

      <UngroupingDialog<T> onUngroup={updateRowsGroup} />

      <DeleteEntitiesDialog data={rowData} />
    </>
  );
};

function getFullySelectedGroups(selected: any[], rows: any[]) {
  const selectedIds = new Set(selected.map((r) => r.id));
  const groupMap = new Map<string, any[]>();

  rows.forEach((row) => {
    if (row.rowType === "item" && Array.isArray(row.group)) {
      const groupKey = JSON.stringify(row.group.slice(0, -1));
      if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
      groupMap.get(groupKey)!.push(row);
    }
  });

  const fullySelectedGroups = new Set<string>();

  for (const [key, items] of groupMap.entries()) {
    if (items.every((item) => selectedIds.has(item.id))) {
      fullySelectedGroups.add(key);
    }
  }

  const finalGroups: string[][] = [];

  for (const key of fullySelectedGroups) {
    const group = JSON.parse(key) as string[];

    const hasParent = group
      .map((_, i) => group.slice(0, i))
      .filter((prefix) => prefix.length > 0)
      .some((prefix) => fullySelectedGroups.has(JSON.stringify(prefix)));

    if (!hasParent) {
      finalGroups.push(group);
    }
  }

  const groupsToKeep: string[] = finalGroups.map(
    (groupArray) => groupArray.at(-1)!
  );

  return groupsToKeep;
}
