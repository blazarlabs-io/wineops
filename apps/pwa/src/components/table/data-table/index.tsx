/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useGrouping } from "@/hooks/use-grouping";
import { useAuth } from "@/lib/firebase/auth";
import { DashboardEntity } from "@/models/types/dashboard";
import { DbResponse } from "@/models/types/db";
import { nodesToEntities } from "@/utils/notes-to-entities";
import { Typography } from "@mui/material";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ExcelExportModule,
  GetDataPath,
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
  isDarkMode?: boolean;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
  data?: T[];
  onChangeData?: (data: T[]) => void;
  entryKey?: keyof T;
  updateSelectedData: (data: T[]) => void;
  columns: ColDef[];
  //groupCellRenderer: FunctionComponent<CustomCellRendererProps>;
  updateGroup: (uid: string, rows: Partial<T>[]) => Promise<DbResponse>;
  groupColumnDef?: ColDef<any, any>;
}

export const DataTable = <T extends DashboardEntity>({
  gridTheme = "ag-theme-quartz",
  isDarkMode,
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
  data = [],
  updateSelectedData,
  columns,
  //groupCellRenderer,
  updateGroup,
  groupColumnDef,
}: DataTableProps<T>) => {
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

  // * Event Handlers
  const handleOnRowSelected = useCallback(
    (data: any) => {
      updateSelectedData(data.api.getSelectedRows());
    },
    [updateSelectedData]
  );

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  /*const normalizedData: T[] = useMemo(
    () =>
      rowData.map((row: T) => ({
        ...row,
        group: [
          ...(!row.group || row.group.length < 1
            ? [row[entryKey] ?? row.id]
            : row.group),
        ],
      })),
    [entryKey, rowData]
  );*/

  const {
    groupToExpand,
    uniqueGroups,
    groupedData,
    selectedRows,
    setGroupedData,
    setSelectedRows,
    setGroupToExpand,
  } = useGrouping<T>(rowData);

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      // * Selected items in an array format, Only list of items grouping is ignored
      const entities = nodesToEntities<T>(selectedNodes);
      onChangeData?.(entities);
      setSelectedRows(entities);
    },
    [onChangeData, setSelectedRows]
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
        row.group.every((val, i) => val === group[i])
    );

    if (existingGroup) return;

    return {
      id: Date.now().toString(),
      rowType: "group",
      group,
    };
  };

  const updateRowsGroup = async (group: string[] = []) => {
    const isGrouping = group.length > 0;

    if (!uid || selectedRows.length === 0) return;

    setGroupToExpand(group);

    const newGroup = createNewGroup(group);

    const updatedRows = selectedRows.map((row) => ({
      id: row.id,
      rowType: row.rowType,
      group:
        group.length > 0
          ? row.rowType === "group"
            ? (newGroup?.group ?? group)
            : [...(newGroup?.group ?? group), row.name]
          : row.rowType === "group"
            ? [...row.group.slice(0, -2), row.group[row.group.length - 1]]
            : [...row.group.slice(0, -2), row.name],
    }));

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

    setSelectedRows([]);
    gridRef.current?.api?.deselectAll();

    const updateRes: DbResponse = await updateGroup(
      uid,
      (newGroup
        ? [...updatedRowsWithUnused, newGroup]
        : updatedRowsWithUnused) as Partial<T>[]
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
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);

  useEffect(() => {
    if (rowData && rowData.length > 0) {
      setGroupedData(rowData);
    }
  }, [rowData, setGroupedData]);

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

          setSelectedRows([]);
          gridRef.current?.api?.deselectAll();

          if (target?.group) {
            setGroupToExpand(target.group);
          }

          await updateGroup(uid, updatedNewRowData as T[]);
          enqueueSnackbar("Saved changes", { variant: "success" });
        }
        gridRef.current!.api.clearFocusedCell();
      }
      // clear node to highlight
      setPotentialParentForNode(event.api, null);
    },
    [
      enqueueSnackbar,
      potentialParent,
      setGroupToExpand,
      setPotentialParentForNode,
      setSelectedRows,
      uid,
      updateGroup,
    ]
  );

  return (
    <>
      <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
        {groupedData && groupedData.length > 0 ? (
          <AgGridReact
            theme={myTheme}
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
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
            }}
            rowSelection={rowSelection}
            onRowSelected={handleOnRowSelected}
            onSelectionChanged={handleOnSelectionChanged}
            containerStyle={{ height: "100%", width: "100%" }}
            isGroupOpenByDefault={isGroupOpenByDefault}
            onRowDragMove={onRowDragMove}
            onRowDragLeave={onRowDragLeave}
            onRowDragEnd={onRowDragEnd}
            getRowId={(params) => params.data.id}
            suppressRowHoverHighlight={true}
            suppressCellFocus={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Typography color="textSecondary" className="">
              Nothing to show.
            </Typography>
          </div>
        )}
      </div>
      <GroupingDialog<T>
        groups={uniqueGroups}
        rows={selectedRows}
        open={openGroupingDialog}
        onClose={handleCloseGroupingDialog}
        onAddToGroup={updateRowsGroup}
      />
      <UngroupingDialog<T>
        rows={selectedRows}
        open={openUngroupingDialog}
        onClose={handleCloseUngroupingDialog}
        onUngroup={updateRowsGroup}
      />
    </>
  );
};

const getUnusedGroups = (data: DashboardEntity[]) => {
  const leafGroupPaths = data
    .filter((item) => item.rowType !== "group" && Array.isArray(item.group))
    .map((item) => item.group.join("|"));

  const groupOnlyRows = data.filter(
    (item) => item.rowType === "group" && Array.isArray(item.group)
  );

  const unusedGroups = groupOnlyRows.filter((groupRow) => {
    const groupPath = groupRow.group.join("|");
    return !leafGroupPaths.some(
      (leafPath) =>
        leafPath.startsWith(groupPath + "|") || leafPath === groupPath
    );
  });

  return unusedGroups;
};
