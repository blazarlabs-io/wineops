/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { useVineyard } from "@/context/vineyard";
import {
  ENTITY_DETAILS,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED,
} from "@/data/constants";
import { useGrouping } from "@/hooks/use-grouping";
import { useAuth } from "@/lib/firebase/auth";
import { DashboardEntity } from "@/models/types/dashboard";
import { DbResponse, Vineyard } from "@/models/types/db";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
import { Typography } from "@mui/material";
import {
  AllCommunityModule,
  CellClassParams,
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
  ValueFormatterParams,
} from "ag-grid-enterprise";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useSnackbar } from "notistack";
import {
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { shiftGroups } from "../vineyards/utils";

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
  updateGroup: (
    uid: string,
    rows: Partial<T>[],
    group: string[]
  ) => Promise<DbResponse>;
  selectionCellRenderer: FunctionComponent<CustomCellRendererProps>;
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
  entryKey = "name" as keyof T,
  columns,
  //groupCellRenderer,
  updateGroup,
  selectionCellRenderer,
  groupColumnDef,
}: DataTableProps<T>) => {
  const { enqueueSnackbar } = useSnackbar();

  const { vineyards } = useVineyard();

  // * Main Data Grid Ref
  const gridRef = useRef<AgGridReact>(null);

  // * Column Definitions
  const colDefs = useMemo(() => columns, [columns]);

  // * Row Data
  // const [rowData] = useState(getData());
  const [rowData, setRowData] = useState(vineyards);
  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT);
  const [expandedRowHeight] = useState(ROW_HEIGHT_EXPANDED);

  const [potentialParent, setPotentialParent] = useState<any>(null);

  // * Get Data Path ["group", "vineyard"]
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
      // enableClickSelection: true,
      groupSelects: "descendants",
      checkboxLocation: "autoGroupColumn",
    };
  }, []);

  // * Event Handlers
  const handleOnRowSelected = useCallback(
    (data: any) => {
      //updateSelectedVineyards(data.api.getSelectedRows());

      updateSelectedData(data.api.getSelectedRows());
    },
    [updateSelectedData]
  );

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      // * Selected vineyards in an array format, Only list of vineyards grouping is ignored
      const _vineyards = nodesToVineyards(selectedNodes);
      console.log("_vineyards", _vineyards);
      onChangeData?.(_vineyards as T[]);
      setSelectedRows(_vineyards as T[]);
    },
    []
  );

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  const normalizedData: T[] = useMemo(
    () =>
      (rowData as T[]).map((row: T) => ({
        ...row,
        group: [
          ...(!row.group || row.group.length < 1
            ? [row[entryKey] ?? row.id]
            : row.group),
          // ENTITY_DETAILS,
        ],
      })),
    [entryKey, rowData]
  );

  const {
    groupToExpand,
    uniqueGroups,
    groupedData,
    selectedRows,
    setGroupedData,
    setSelectedRows,
    setGroupToExpand,
  } = useGrouping<T>(normalizedData);

  const { user } = useAuth();
  const uid = user?.uid || "";

  const updateRowsGroup = async (group?: string[]) => {
    const isGrouping = group && group.length > 0;

    if (!uid || selectedRows.length === 0) return;

    setGroupToExpand(isGrouping ? group : []);

    const rows = selectedRows.map((row) => ({
      id: row.id,
      [entryKey]: row[entryKey],
    }));

    const updateRes: DbResponse = await updateGroup(
      uid,
      rows as Partial<T>[],
      isGrouping ? group : []
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

  const getRowHeight = useCallback(
    (params: any) => {
      // console.log("params", params);
      if (params.data) {
        return rowHeight;
      } else {
        return rowHeight;
      }
    },
    [rowHeight]
  );

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
      setRowData(data as Vineyard[]);
    }
  }, [data]);

  useEffect(() => {
    if (normalizedData && normalizedData.length > 0) {
      setGroupedData(normalizedData);
    }
  }, [normalizedData, setGroupedData]);

  const isGroupOpenByDefault = useCallback(
    (params: IsGroupOpenByDefaultParams) => {
      const route = params.rowNode.getRoute();
      return !!route?.every((item, idx) => groupToExpand[idx] === item);
    },
    [groupToExpand]
  );

  const setPotentialParentForNode = useCallback(
    (
      api: GridApi<Vineyard>,
      overNode: IRowNode<Vineyard> | undefined | null
    ) => {
      let newPotentialParent: IRowNode<Vineyard> | null = null;
      if (overNode) {
        if (overNode.data?.rowType === "group") {
          // over a group, we take the immediate row
          newPotentialParent = overNode;
        } else if (overNode.parent) {
          // over a item/vineyard, we take the parent row (which will be a group)
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

  function refreshRows(api: GridApi, rowsToRefresh: IRowNode<Vineyard>[]) {
    const params: RefreshCellsParams<Vineyard> = {
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
      // console.log("onRowDragMove", event);
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
    (event: RowDragEndEvent) => {
      // console.log("onRowDragEnd", event, potentialParent);

      const target = event.overNode?.data;
      if (!potentialParent && target) {
        return; // no move
      }
      const source = event.node.data;
      const rowData = event.api.getGridOption("rowData");

      // console.log("onRowDragEnd", rowData, source, target);

      if (rowData && source && source !== target) {
        const newRowData = shiftGroups(rowData, source, target);
        // console.log("onRowDragEnd", newRowData);
        if (!newRowData) {
          console.log("invalid move");
        } else if (newRowData !== rowData) {
          console.log("onRowDragEnd, modifying grid row data");
          event.api.setGridOption("rowData", newRowData);
          // setRowData(newRowData);
          setGroupedData(newRowData as T[]);
          // setSelectedRows(newRowData as T[]);
        }
        gridRef.current!.api.clearFocusedCell();
      }
      // clear node to highlight
      setPotentialParentForNode(event.api, null);
    },
    [potentialParent, setGroupedData, setPotentialParentForNode]
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
                  // console.log("\nXXXX", params.node, potentialParent);
                  return params.node === potentialParent;
                },
              },
            }}
            rowSelection={rowSelection}
            onRowSelected={handleOnRowSelected}
            onSelectionChanged={handleOnSelectionChanged}
            containerStyle={{ height: "100%", width: "100%" }}
            isGroupOpenByDefault={isGroupOpenByDefault}
            // getRowHeight={getRowHeight}
            onRowDragMove={onRowDragMove}
            onRowDragLeave={onRowDragLeave}
            onRowDragEnd={onRowDragEnd}
            getRowId={(params): string => params.data.id}
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
