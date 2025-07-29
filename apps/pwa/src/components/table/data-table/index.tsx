import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";
import { useToolsbar } from "@/context/tools-bar";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { DashboardEntity, GroupBy } from "@/models/types/dashboard";
import { DbResponse, EntityName } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useGridStore } from "@/store/grid";
import { usePinnedEntitiesStore } from "@/store/pinned-entities";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import getUnusedGroups from "@/utils/get-unused-groups";
import { nodesToEntities } from "@/utils/notes-to-entities";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography, useColorScheme } from "@mui/material";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ExcelExportModule,
  FindChangedEvent,
  FindModule,
  GetDataPath,
  GetRowIdFunc,
  GridApi,
  IRowNode,
  IsGroupOpenByDefaultParams,
  MasterDetailModule,
  ModuleRegistry,
  PinnedRowModule,
  RefreshCellsParams,
  RichSelectModule,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  RowGroupingModule,
  RowSelectionModule,
  RowSelectionOptions,
  SelectionChangedEvent,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
  themeMaterial,
  TreeDataModule,
  ValidationModule,
  GridReadyEvent,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shiftGroups } from "../utils";
import "./style.css";

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
  SideBarModule,
  FindModule,
  ValidationModule,
  PinnedRowModule,
  RowSelectionModule,
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
  defaultGroupedBy?: GroupBy;
}

export const DataTable = <T extends DashboardEntity>({
  gridTheme = "ag-theme-quartz",
  data,
  columns,
  groupColumnDef,
  groupByButtons,
  getRowId,
  entityName,
  defaultGroupedBy,
}: DataTableProps<T>) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { pinned } = usePinnedEntitiesStore();
  const { enqueueSnackbar } = useSnackbar();
  const { gridRef, updateActiveMatchNum, findSearchValue } = useToolsbar();

  const colDefs = useMemo(() => columns, [columns]);

  const [rowData, setRowData] = useState<T[]>();
  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT);
  const [potentialParent, setPotentialParent] = useState<any>(null);
  const [dragOverRowId, setDragOverRowId] = useState<string | null>(null);
  const enableRowPinning = true;

  const getDataPath = useCallback<GetDataPath>((data) => {
    return data.group;
  }, []);

  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const myTheme = themeMaterial
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
      pinnedRowBorder: {
        width: 2,
      },
    })
    .withParams(
      {
        backgroundColor: "#121212",
        foregroundColor: "#FFFFFFCC",
        selectedRowBackgroundColor: "#99C3FF22",
        browserColorScheme: "dark",
        headerBackgroundColor: "#212121aa",
        checkboxCheckedBackgroundColor: "#99C3FF",
      },
      "dark",
    )
    .withParams(
      {
        backgroundColor: "#FFFFFFCC",
        foregroundColor: "#361008CC",
        selectedRowBackgroundColor: "#99C3FF22",
        browserColorScheme: "light",
        headerBackgroundColor: "#FFFFFFCC",
        checkboxCheckedBackgroundColor: "#1565C0",
      },
      "light",
    );

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return { ...groupColumnDef };
  }, [groupColumnDef]);

  const selectionColumnDef = useMemo<ColDef>(() => {
    return {
      pinned: "left",
      width: 72,
    };
  }, []);

  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.dataset.agThemeMode = "light";
    }
  }, [gridTheme, isDarkMode]);

  const setSelected = useSelectedEntitiesStore((state) => state.setSelected);

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      const entities = nodesToEntities<T>(selectedNodes);
      setSelected(entities, entityName);
    },
    [entityName, setSelected],
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
        row.group.every((val: any, i: any) => val === group[i]),
    );

    if (existingGroup) return;

    return {
      id: crypto.randomUUID(),
      rowType: "group",
      group,
    };
  };

  const updateRowsGroup = async (selectedRows: T[], group: string[] = []) => {
    if (
      !rowData ||
      !data ||
      !entityName ||
      !db[entityName] ||
      !uid ||
      selectedRows.length === 0
    )
      return;

    const isGrouping = group.length > 0;

    setGroupToExpand(group);

    const newGroup = createNewGroup(group);

    const newGroups = newGroup?.group ? [newGroup] : [];

    const fullySelectedGroups = getFullySelectedGroups(selectedRows, data);

    const updatedRows = selectedRows.map((row) => {
      const groupPrefix = newGroup?.group ?? group;
      const foundGroupIndex = row.group.findIndex((item) =>
        fullySelectedGroups.includes(item),
      );

      const hierarchyGroup =
        foundGroupIndex !== undefined && foundGroupIndex > -1
          ? [...groupPrefix, ...(row.group.slice(foundGroupIndex, -1) ?? [])]
          : groupPrefix;

      const newHierarchyGroup = createNewGroup(hierarchyGroup);

      if (
        isGrouping &&
        newHierarchyGroup &&
        newHierarchyGroup?.group?.length > 0
      ) {
        if (
          !newGroups.find(
            (newGroup) =>
              newGroup.group.join(",") === newHierarchyGroup.group.join(","),
          )
        ) {
          newGroups.push(newHierarchyGroup);
        }
      }

      return {
        id: row.id,
        rowType: row.rowType,
        group:
          group.length > 0 && row.rowType !== undefined
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
      (row) => (updatedMap.has(row.id) ? updatedMap.get(row.id) : row) as T,
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
        : updatedRowsWithUnused,
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
    setRowData(data);
  }, [data]);

  const [groupToExpand, setGroupToExpand] = useState<string[]>([]);

  const isGroupOpenByDefault = useCallback(
    (params: IsGroupOpenByDefaultParams) => {
      const route = params.rowNode.getRoute();
      return !!route?.every((item, idx) => groupToExpand[idx] === item);
    },
    [groupToExpand],
  );

  const setPotentialParentForNode = useCallback(
    (api: GridApi<T>, overNode: IRowNode<T> | undefined | null) => {
      let newPotentialParent: IRowNode<T> | null = null;
      if (overNode) {
        if (overNode.data?.rowType === "group") {
          newPotentialParent = overNode;
        } else if (overNode.parent) {
          newPotentialParent = overNode.parent;
        }
      }
      const alreadySelected = potentialParent === newPotentialParent;
      if (alreadySelected) {
        return; // no change
      }
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
    [potentialParent],
  );

  function refreshRows(api: GridApi, rowsToRefresh: IRowNode<T>[]) {
    const params: RefreshCellsParams<T> = {
      rowNodes: rowsToRefresh,
      force: true,
    };
    api.refreshCells(params);
  }

  const onRowDragMove = useCallback(
    (event: RowDragMoveEvent) => {
      setDragOverRowId(event.node.id as string);
      setPotentialParentForNode(event.api, event.overNode);
    },
    [setPotentialParentForNode],
  );

  const onRowDragLeave = useCallback(
    (event: RowDragLeaveEvent) => {
      setPotentialParentForNode(event.api, null);
    },
    [setPotentialParentForNode],
  );

  const onRowDragEnd = useCallback(
    async (event: RowDragEndEvent) => {
      setDragOverRowId(null);
      const target = event.overNode?.data;
      if (!potentialParent && target) {
        return; // no move
      }
      const source = event.node.data;
      const rowData = event.api.getGridOption("rowData");

      if (rowData && source && source !== target) {
        const newRowData = shiftGroups<T>(rowData, source, target);
        if (!newRowData) {
        } else if (newRowData !== rowData) {
          if (!entityName || !db[entityName]) return;

          event.api.setGridOption("rowData", newRowData);

          const unusedGroupsIds = getUnusedGroups(newRowData).map(
            ({ id }) => id,
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
      setPotentialParentForNode(event.api, null);
    },
    [
      enqueueSnackbar,
      entityName,
      gridRef,
      potentialParent,
      setPotentialParentForNode,
      setSelected,
      uid,
    ],
  );

  const treeData = gridRef.current?.api?.getGridOption("treeData");

  const { groupedField, setGroupedField } = useGridStore();

  const handleGroupBy = useCallback(
    (field?: GroupBy) => {
      const api = gridRef.current?.api;

      if (!api) return;

      const isAlreadyGrouped = !field;

      if (isAlreadyGrouped) {
        api.setRowGroupColumns([]);
        api.updateGridOptions({ treeData: true });
      } else {
        api.setRowGroupColumns([field]);
        api.updateGridOptions({ treeData: false });
      }

      const allCols = api.getColumns() || [];

      const columnsToToggleVisibility = allCols.filter(
        (col: any) =>
          col?.getColDef()?.headerName === autoGroupColumnDef?.headerName ||
          col?.getColDef()?.headerName === groupColumnDef?.headerName,
      );

      if (columnsToToggleVisibility.length > 0) {
        api.setColumnsVisible(columnsToToggleVisibility, !isAlreadyGrouped);
      }

      api.setColumnsVisible(
        ["vesselId"],
        isAlreadyGrouped &&
          ["groupByVesselType", "groupByLocation"].includes(groupedField || ""),
      );

      api.setColumnsVisible(["statusData"], groupedField !== "groupByStatus");
    },
    [
      autoGroupColumnDef?.headerName,
      gridRef,
      groupColumnDef?.headerName,
      groupedField,
    ],
  );

  const isRowPinned = useCallback(
    (params: any) => {
      const data = params.data;
      return pinned && pinned?.includes(data) ? "top" : undefined;
    },
    [pinned],
  );

  const onFindChanged = useCallback((event: FindChangedEvent) => {
    const { activeMatch, totalMatches, findSearchValue } = event;
    updateActiveMatchNum(
      findSearchValue?.length
        ? `${activeMatch?.numOverall ?? 0}/${totalMatches}`
        : "",
    );
  }, []);

  useEffect(() => {
    handleGroupBy(groupedField);
  }, [groupedField, handleGroupBy]);

  const filteredData = rowData?.filter(
    ({ rowType }) => rowType === "item" || rowType !== "group",
  );

  useEffect(() => {
    return () => {
      setSelected([]);
    };
  }, [setSelected]);

  const pathname = usePathname();
  const open = useDialogDrawerStore(({ open }) => open);
  const openAddVineyard = () => open("form-drawer");

  const handleOnGridReady = (_params: GridReadyEvent) => {
    if (!defaultGroupedBy || groupedField === defaultGroupedBy) return;
    setGroupedField(defaultGroupedBy);
  };

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
        {filteredData && filteredData.length > 0 ? (
          <AgGridReact
            theme={myTheme}
            ref={gridRef}
            columnDefs={colDefs}
            rowData={groupedField ? filteredData : rowData}
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
                  ({ columnName }) => columnName === groupedField,
                )?.name ||
                groupedField?.replace("groupBy", "") ||
                autoGroupColumnDef.headerName,
              checkboxSelection: false,
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
            suppressGroupChangesColumnVisibility={columns.some(({ field }) =>
              field?.startsWith("groupBy"),
            )}
            enableRowPinning={enableRowPinning}
            isRowPinned={isRowPinned}
            rowClassRules={{
              "pinned-row": (params) => !!params.node.rowPinned,
              "row-dragging": (params) => {
                return !!(params.node as any)?.dragging;
              },
              "cell-drag-over": (params) => params.node.id === dragOverRowId,
            }}
            findSearchValue={findSearchValue}
            onFindChanged={onFindChanged}
            enableCellTextSelection={true}
            selectionColumnDef={selectionColumnDef}
            onGridReady={handleOnGridReady}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {pathname.includes("vineyards") ? (
              !filteredData ? (
                <>Loading...</>
              ) : filteredData.length === 0 ? (
                <>
                  <Button
                    variant="text"
                    startIcon={<Add />}
                    onClick={openAddVineyard}
                  >
                    Add vineyard
                  </Button>
                </>
              ) : (
                <Typography color="textSecondary" className="">
                  Nothing to show.
                </Typography>
              )
            ) : (
              <Typography color="textSecondary" className="">
                Nothing to show.
              </Typography>
            )}
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
    (groupArray) => groupArray.at(-1)!,
  );

  return groupsToKeep;
}
