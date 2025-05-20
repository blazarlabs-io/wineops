/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupingDialog from "@/components/dialogs/grouping-dialog";
import UngroupingDialog from "@/components/dialogs/ungrouping-dialog";
import { useVineyard } from "@/context/vineyard";
import {
  ENTITY_DETAILS,
  GROUP_COLUMN_WIDTH,
  ROW_HEIGHT_DEFAULT,
  ROW_HEIGHT_EXPANDED,
} from "@/data/constants";
import { useGrouping } from "@/hooks/use-grouping";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { DbResponse, Vineyard } from "@/models/types/db";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ExcelExportModule,
  GetDataPath,
  IRowNode,
  IsGroupOpenByDefaultParams,
  MasterDetailModule,
  ModuleRegistry,
  RichSelectModule,
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
import {
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GroupCellRenderer } from "./cell-renderers/GroupCellRenderer";
import { vineyardColumns } from "./columns";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { Typography } from "@mui/material";

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
]);

interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
  data?: Vineyard[];
  onChangeData?: (data: Vineyard[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export const DataTable: FunctionComponent<Props> = ({
  gridTheme = "ag-theme-quartz",
  isDarkMode,
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}) => {
  const { vineyards, updateSelectedVineyards } = useVineyard();
  const { enqueueSnackbar } = useSnackbar();

  // * Main Data Grid Ref
  const gridRef = useRef<AgGridReact>(null);

  // * Column Definitions
  const [colDefs] = useState<ColDef[]>(vineyardColumns);

  // * Row Data
  // const [rowData] = useState(getData());
  const [rowData, setRowData] = useState(vineyards);
  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT);
  const [expandedRowHeight] = useState(ROW_HEIGHT_EXPANDED);

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

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  // * Define the auto-group column
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Name",
      field: "group",
      minWidth: GROUP_COLUMN_WIDTH,
      cellRenderer: "agGroupCellRenderer",
      filter: "agTextColumnFilter",
      cellRendererParams: {
        innerRenderer: GroupCellRenderer,
        suppressCount: true,
      },
    };
  }, []);

  // * Row Selection Options
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      // enableClickSelection: true,
      groupSelects: "descendants",
      suppressDoubleClickExpand: false,
      suppressEnterExpand: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    };
  }, []);

  // * Selection Column Definition
  const selectionColumnDef = useMemo(() => {
    return {
      headerName: "",
      field: "selection",
      sortable: false,
      resizable: true,
      width: 48,
      suppressHeaderMenuButton: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: any) => {
          // console.log("SELECT-COLUMN", params);
          return (
            <>
              {!params.node.group && (
                <div
                  style={{
                    backgroundColor: "var(--mui-palette-background-default)",
                  }}
                  className="flex items-start justify-center flex-col gap-2 pl-2 absolute h-full top-0 left-0 w-full z-[999]"
                >
                  <VineyardDetailsWidget vineyard={params.node.data} />
                </div>
              )}
            </>
          );
        },
      },
      colSpan: (params: any) => {
        // console.log("colSpan", params.node.group, colDefs.length);
        if (params.node.group) {
          return 1;
        } else {
          // return the length of all columns
          return colDefs.length + 2;
        }
      },
    };
  }, []);

  // * Event Handlers
  const handleOnRowSelected = useCallback((data: any) => {
    updateSelectedVineyards(data.api.getSelectedRows());
  }, []);

  const handleOnSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes: IRowNode[] = event.api.getSelectedNodes();
      // * Selected vineyards in an array format, Only list of vineyards grouping is ignored
      const _vineyards = nodesToVineyards(selectedNodes);
      console.log("_vineyards", _vineyards);
      onChangeData?.(_vineyards);
      setSelectedRows(_vineyards);
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

  const normalizedData: Vineyard[] = useMemo(
    () =>
      rowData.map((row: Vineyard) => ({
        ...row,
        group: [
          ...(!row.group || row.group.length < 2
            ? [row.name ?? row.id]
            : row.group),
          ENTITY_DETAILS,
        ],
      })),
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
  } = useGrouping<Vineyard>(normalizedData);

  const { user } = useAuth();
  const uid = user?.uid || "";

  const updateRowsGroup = async (group?: string[]) => {
    const isGrouping = group && group.length > 0;

    if (!uid || selectedRows.length === 0) return;

    setGroupToExpand(isGrouping ? group : []);

    const rows = selectedRows.map(({ id, name }) => ({ id, name }));

    const updateRes: DbResponse = await db.vineyard.updateGroup(
      uid,
      rows,
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
        return expandedRowHeight;
      } else {
        return rowHeight;
      }
    },
    [rowHeight]
  );

  useEffect(() => {
    if (vineyards && vineyards.length > 0) {
      setRowData(vineyards);
    }
  }, [vineyards]);

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

  return (
    <>
      <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
        {groupedData && groupedData.length > 0 ? (
          <AgGridReact
            masterDetail={true}
            theme={myTheme}
            ref={gridRef}
            columnDefs={colDefs}
            rowData={groupedData}
            getDataPath={getDataPath}
            treeData
            autoGroupColumnDef={autoGroupColumnDef}
            rowSelection={rowSelection as RowSelectionOptions}
            selectionColumnDef={selectionColumnDef as ColDef}
            onRowSelected={handleOnRowSelected}
            onSelectionChanged={handleOnSelectionChanged}
            containerStyle={{ height: "100%", width: "100%" }}
            isGroupOpenByDefault={isGroupOpenByDefault}
            getRowHeight={getRowHeight}
            defaultColDef={defaultColDef}
            suppressRowHoverHighlight={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Typography color="textSecondary" className="">
              No Vineyards found.
            </Typography>
          </div>
        )}
      </div>

      <GroupingDialog<Vineyard>
        groups={uniqueGroups}
        rows={selectedRows}
        open={openGroupingDialog}
        onClose={handleCloseGroupingDialog}
        onAddToGroup={updateRowsGroup}
      />
      <UngroupingDialog<Vineyard>
        rows={selectedRows}
        open={openUngroupingDialog}
        onClose={handleCloseUngroupingDialog}
        onUngroup={updateRowsGroup}
      />
    </>
  );
};
