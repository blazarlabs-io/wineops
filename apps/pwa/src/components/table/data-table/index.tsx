/* eslint-disable @typescript-eslint/no-explicit-any */
import { useVineyard } from "@/context/vineyard";
import { Vineyard } from "@/models/types/db";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ExcelExportModule,
  GetDataPath,
  IDetailCellRendererParams,
  IRowNode,
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
import {
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DetailCellRenderer from "./cell-renderers/DetailCellRenderer";
import { GroupCellRenderer } from "./cell-renderers/GroupCellRenderer";
import { vineyardColumns } from "./columns";

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
}

export const DataTable: FunctionComponent<Props> = ({
  gridTheme = "ag-theme-quartz",
  isDarkMode,
  onChangeData,
}) => {
  const { vineyards, updateSelectedVineyards } = useVineyard();

  // * Main Data Grid Ref
  const gridRef = useRef<AgGridReact>(null);

  // * Column Definitions
  const [colDefs] = useState<ColDef[]>(vineyardColumns);

  // * Row Data
  // const [rowData] = useState(getData());
  const [rowData, setRowData] = useState(vineyards);

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

  // * Define the auto-group column
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "",
      field: "group",
      width: 196,
      pinned: "left",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        innerRenderer: GroupCellRenderer,
        // suppressCount: true,
      },
      suppressSizeToFit: true,
    };
  }, []);

  // * Row Selection Options
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      enableClickSelection: true,
      groupSelects: "descendants",
      suppressDoubleClickExpand: false,
      suppressEnterExpand: false,
    };
  }, []);

  // * Selection Column Definition
  const selectionColumnDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      width: 80, //48,
      suppressHeaderMenuButton: false,
      pinned: "left",
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
      const vineyards = nodesToVineyards(selectedNodes);
      onChangeData?.(vineyards);
    },
    []
  );

  const detailCellRenderer = useCallback(DetailCellRenderer, []);

  // params sent to the Detail Cell Renderer, in this case your MyCellRendererComp
  const detailCellRendererParams = useMemo(() => {
    return {
      detailGridOptions: {},
      getDetailRowData: function (params: any) {
        console.log("params", params.data);
        // params.successCallback(params.data.callRecords);
      },
      groupDefaultExpanded: 1,
      masterDetail: true,
      detailRowHeight: 240,
      detailRowAutoHeight: true,
      detailCellRendererParams: {
        // level 3 grid options
        detailGridOptions: {
          // columnDefs: [
          //   { field: "info.", cellRenderer: "agGroupCellRenderer" },
          //   { field: "b3" },
          // ],
          defaultColDef: {
            flex: 1,
          },
        },
        getDetailRowData: (params) => {
          params.successCallback(params.data.children);
        },
      } as IDetailCellRendererParams,
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

  useEffect(() => {
    if (vineyards && vineyards.length > 0) {
      setRowData(vineyards);
    }
  }, [vineyards]);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
      {rowData && rowData.length > 0 && (
        <AgGridReact
          masterDetail={true}
          theme={myTheme}
          ref={gridRef}
          columnDefs={colDefs}
          rowData={rowData}
          groupDefaultExpanded={0}
          getDataPath={getDataPath}
          treeData
          autoGroupColumnDef={autoGroupColumnDef}
          rowSelection={rowSelection as RowSelectionOptions}
          selectionColumnDef={selectionColumnDef as ColDef}
          onRowSelected={handleOnRowSelected}
          onSelectionChanged={handleOnSelectionChanged}
          containerStyle={{ height: "100%", width: "100%" }}
          detailCellRenderer={detailCellRenderer}
          detailCellRendererParams={detailCellRendererParams}
        />
      )}
    </div>
  );
};
