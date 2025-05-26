/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  //ENTITY_DETAILS,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED,
} from "@/data/constants";
import {
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  IRowNode,
  ModuleRegistry,
  RenderApiModule,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  RowSelectedEvent,
  RowSelectionModule,
  RowSelectionOptions,
  SelectionChangedEvent,
  themeBalham,
  ValidationModule,
  PinnedRowModule,
  RowNode,
  ValueFormatterParams,
  StateUpdatedEvent,
  IsGroupOpenByDefaultParams,
} from "ag-grid-community";
import {
  TreeDataModule,
  PivotModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cellClassRules,
  columns,
  potentialParent,
  setPotentialParentForNode,
} from "./config";
import { DATA } from "./data";
import { IFile, shiftGroups } from "./fileUtils";
import GroupCellRenderer from "./group-cell-renderer";
import "./style.css";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";

import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ColumnsToolPanelModule,
  //PivotModule,
  FiltersToolPanelModule,
} from "ag-grid-enterprise";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { NumberFilterModule, PaginationModule } from "ag-grid-community";
import { SetFilterModule, CellSelectionModule } from "ag-grid-enterprise";
import { useGrouping } from "@/hooks/use-grouping";
import { DashboardEntity } from "@/models/types/dashboard";
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";

import {
  Add,
  DeleteOutline,
  Deselect,
  Edit,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";

ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  RenderApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  TreeDataModule,
  RowSelectionModule,
  PinnedRowModule,
  PivotModule,
  ContextMenuModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
  // TODO: Row grouping
  RowGroupingModule,
  RowGroupingPanelModule,

  ColumnsToolPanelModule,

  // TODO: Pivoting
  //PivotModule,
  FiltersToolPanelModule,

  NumberFilterModule,
  PaginationModule,
  SetFilterModule,
  CellSelectionModule,
]);

interface BaseTableProps<T extends DashboardEntity> {
  gridTheme?: string;
  isDarkMode?: boolean;
  pinnedRows?: any;
  onRowSelection?: (rows: any) => void;
  data?: T[];
}

export default function BaseTable<T extends DashboardEntity>({
  gridTheme = "ag-theme-quartz",
  isDarkMode = false,
  pinnedRows,
  onRowSelection,
  data = [],
}: BaseTableProps<T>) {
  const gridRef = useRef<AgGridReact<IFile>>(null);
  const [rowData, setRowData] = useState<IFile[]>(DATA);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(columns);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      enableRowGroup: true,
      //enablePivot: true,
      enableValue: true,
    };
  }, []);

  // * DATA PATH
  const getDataPath = useCallback((data: IFile) => data.group, []);

  // * ROW ID
  const getRowId = useCallback(({ data }: { data: IFile }) => data.id, []);

  // * AUTO GROUP COLUMN
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      rowDrag: true,
      headerName: "Group Name",
      minWidth: 300,
      cellRendererParams: {
        suppressCount: false,
        innerRenderer: GroupCellRenderer,
      },
      cellClassRules: {
        "hover-over": (params) => {
          return params.node === potentialParent;
        },
      },
      cellRenderer: "agGroupCellRenderer",
    };
  }, []);

  // * THEMING
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
      rowHeight: 88,
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

  // * DRAGGING EVENTS
  const onRowDragMove = useCallback((event: RowDragMoveEvent) => {
    setPotentialParentForNode(event.api, event.overNode);
  }, []);

  const onRowDragLeave = useCallback((event: RowDragLeaveEvent) => {
    setPotentialParentForNode(event.api, null);
  }, []);

  const onRowDragEnd = useCallback((event: RowDragEndEvent) => {
    const target = event.overNode?.data;
    if (!potentialParent && target) {
      return; // no move
    }
    const source = event.node.data;
    const rowData = event.api.getGridOption("rowData");
    if (rowData && source && source !== target) {
      const newRowData = shiftGroups(rowData, source, target);
      if (!newRowData) {
        console.log("invalid move");
      } else if (newRowData !== rowData) {
        event.api.setGridOption("rowData", newRowData);

        console.log("newRowData:", newRowData);
      }
      gridRef.current!.api.clearFocusedCell();
    }
    // clear node to highlight
    setPotentialParentForNode(event.api, null);
  }, []);

  // * ROW HEIGHT
  const getRowHeight = (params: any) => {
    if (params.node.group) {
      return ROW_HEIGHT_DEFAULT / 2;
    } else {
      if (params.node.expanded) {
        return ROW_HEIGHT_EXPANDED;
      } else {
        return ROW_HEIGHT_DEFAULT / 2;
      }
    }
  };

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
      checkboxLocation: "autoGroupColumn",
    };
  }, []);

  const handleOnRowSelected = useCallback(
    (data: any) => {
      if (onRowSelection) onRowSelection(data.api.getSelectedRows());
    },
    [onRowSelection]
  );

  // const handlePinnedRowsChanged = useCallback(() => {
  //   if (onRowSelection) onRowSelection(pinnedRows);
  //   console.log("PINNED ROWS CHANGED", pinnedRows);
  // }, [onRowSelection, pinnedRows]);

  // const isRowPinned = useCallback((data: any) => {
  //   return pinnedRows?.some((row: any) => row.id === data.data.id);
  // }, []);

  const [group, setGroup] = useState(false);

  const handleGroupClick = () => {
    setGroup((prev) => !prev);
  };

  const aggFuncs = useMemo(() => {
    return {
      yearsRange: ({ values }: any) => {
        const years = values
          ? values
              .map((value: string) => value && new Date(value).getFullYear())
              .filter((value: number) => value && !Number.isNaN(value))
          : [];

        const startYear = years.length > 0 ? Math.min(...years) : "";
        const endYear = years.length > 0 ? Math.max(...years) : "";

        return `${startYear === endYear ? startYear : `${startYear} - ${endYear}`} `;
      },
    };
  }, []);

  const treeData = gridRef.current?.api?.getGridOption("treeData");
  const onStateUpdated = useCallback(
    ({ state }: StateUpdatedEvent<IFile>) => {
      if (
        treeData &&
        state.rowGroup &&
        state.rowGroup?.groupColIds?.length > 0
      ) {
        //gridRef.current?.api?.setGridOption("treeData", false);
        gridRef.current?.api?.updateGridOptions({ treeData: false });
        gridRef.current?.api?.setRowGroupColumns(state.rowGroup.groupColIds);
        gridRef.current?.api?.refreshClientSideRowModel("group");
      }

      if (!treeData && !state.rowGroup) {
        //gridRef.current?.api?.setGridOption("treeData", true);
        gridRef.current?.api?.updateGridOptions({ treeData: true });
        gridRef.current?.api?.setRowGroupColumns([]);
        gridRef.current?.api?.refreshClientSideRowModel("group");
      }
    },
    [treeData]
  );

  console.log("rowData", rowData);

  // TODO: dialogs for grouping

  const [openGroupingDialog, setOpenGroupingDialog] = useState(false);
  const [openUngroupingDialog, setOpenUngroupingDialog] = useState(false);

  const handleClickOpenGroupingDialog = () => {
    setOpenGroupingDialog(true);
  };

  const handleCloseGroupingDialog = () => {
    setOpenGroupingDialog(false);
  };

  const handleClickOpenUngroupingDialog = () => {
    setOpenUngroupingDialog(true);
  };

  const handleCloseUngroupingDialog = () => {
    setOpenUngroupingDialog(false);
  };

  // TODO: END dialogs for grouping

  const uid = "uid";
  const entryKey = "name" as keyof T;

  const normalizedData: T[] = useMemo(
    () =>
      (rowData as T[])?.map((row: T) => {
        const keys = Object.keys(row);
        const type = keys.every((key) => key === "id" || key === "group")
          ? "group"
          : row?.rowType;

        return {
          ...row,
          /*group: [
            ...(!row.group || row.group.length < 2
              ? [row[entryKey] ?? row.id]
              : row.group),
            //ENTITY_DETAILS,
          ],*/
          type,
        };
      }),
    [rowData]
  );

  const {
    groupToExpand,
    uniqueGroups,
    groupedData,
    selectedRows,
    setGroupedData,
    setSelectedRows,
    setGroupToExpand,
  } = useGrouping<T>(normalizedData as T[]);

  const updateRowsGroup = async (group: string[] = []) => {
    const isGrouping = group.length > 0;

    if (!uid || selectedRows.length === 0) return;

    setGroupToExpand(group);

    const rows = selectedRows.map((row) => ({
      id: row.id,
      [entryKey]: row[entryKey],
    }));

    console.log("selectedRows:", selectedRows);

    const rowsIds = selectedRows.map(({ id }) => id);

    if (isGrouping || 1 === 1) {
      const existingGroup = !!normalizedData.find(
        (row) =>
          row?.group &&
          Array.isArray(row.group) &&
          row.group.length === group.length &&
          row.group.every((val, i) => val === group[i])
      );

      setRowData((prev) => [
        ...(prev?.map((item) => ({
          ...item,
          group: rowsIds.includes(item.id)
            ? [...group, item?.name ?? item?.group[item?.group?.length - 1]]
            : item?.group,
        })) as T[]),
        ...(existingGroup
          ? []
          : [{ id: `${Date.now()}`, group, rowType: "group" } as T]),
      ]);

      setSelectedRows([]);
      if (onRowSelection) onRowSelection([]);

      gridRef.current?.api?.deselectAll();
    }

    /*const updateRes: DbResponse = await updateGroup(
        uid,
        rows as Partial<T>[],
        isGrouping ? group : []
      );*/
    /*const updateRes = { status: 200 };

    if (updateRes.status === 200) {
      enqueueSnackbar(`${isGrouping ? "Grouped" : "Ungrouped"} successfully.`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Failed to ${isGrouping ? "group" : "ungroup"}.`, {
        variant: "error",
      });
    }*/
  };

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      // * Selected vineyards in an array format, Only list of vineyards grouping is ignored
      const entries = nodesToVineyards(selectedNodes);
      setSelectedRows(
        entries.map((entry) => ({
          ...entry,
          name: entry?.name ?? entry?.group[entry?.group?.length - 1],
        })) as T[]
      );
    },
    [setSelectedRows]
  );

  const isGroupOpenByDefault = useCallback(
    (params: IsGroupOpenByDefaultParams) => {
      const route = params.rowNode.getRoute();
      return !!route?.every((item, idx) => groupToExpand[idx] === item);
    },
    [groupToExpand]
  );

  useEffect(() => {
    if (normalizedData && normalizedData.length > 0) {
      setGroupedData(normalizedData);
    }
  }, [normalizedData, setGroupedData]);

  const filteredData = normalizedData?.filter(
    ({ rowType }) => rowType === "item" || rowType !== "group"
  );

  return (
    <>
      <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
        <Stack>
          <Stack gap={2} direction="row" sx={{ my: 2, alignItems: "center" }}>
            <IconButton
              color="default"
              aria-label="group"
              disabled={false}
              onClick={handleClickOpenGroupingDialog}
            >
              <SelectAll />
            </IconButton>

            <IconButton
              color="default"
              size="small"
              aria-label="ungroup"
              disabled={false}
              onClick={handleClickOpenUngroupingDialog}
            >
              <Deselect className="" />
            </IconButton>
          </Stack>
        </Stack>

        <AgGridReact
          ref={gridRef}
          theme={myTheme}
          rowData={!treeData || group ? filteredData : normalizedData}
          columnDefs={
            columnDefs
            /*group
              ? [
                  {
                    headerName: "Name",
                    field: "group",
                    cellClassRules: cellClassRules,

                    valueFormatter: (params: ValueFormatterParams) =>
                      Array.isArray(params?.value)
                        ? params.value[params.value.length - 1]
                        : params.value,
                    enableValue: true,
                    enableRowGroup: true,
                    enablePivot: true,
                  },
                //{
                  //headerName: "Years Range",
                  //field: "dateModified",
                  //aggFunc: "yearsRange",
                  //enableValue: true,
                  //enableRowGroup: true,
                  //enablePivot: true,
                //},
                  ...columnDefs,
                ]
              : columnDefs*/
          }
          defaultColDef={defaultColDef}
          treeData={!group}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          getRowId={getRowId}
          autoGroupColumnDef={autoGroupColumnDef}
          onRowDragMove={onRowDragMove}
          onRowDragLeave={onRowDragLeave}
          onRowDragEnd={onRowDragEnd}
          getRowHeight={getRowHeight}
          pinnedTopRowData={pinnedRows}
          rowSelection={rowSelection}
          onRowSelected={handleOnRowSelected}
          onSelectionChanged={handleOnSelectionChanged}
          // selectionColumnDef={selectionColumnDef}
          // TODO: Row grouping
          //{...gridOptions}
          rowGroupPanelShow="always"
          sideBar={true}
          aggFuncs={aggFuncs}
          onStateUpdated={onStateUpdated}
          isGroupOpenByDefault={isGroupOpenByDefault}
        />
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
}
