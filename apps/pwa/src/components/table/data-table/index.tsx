/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vineyard } from "@/models/types/db";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
import type {
  ColDef,
  GetDataPath,
  IRowNode,
  RowSelectionOptions,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  themeBalham,
} from "ag-grid-community";
import {
  ExcelExportModule,
  MasterDetailModule,
  RichSelectModule,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
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
import { GroupCellRenderer } from "./cell-renderers/GroupCellRenderer";
import { employeeColumns } from "./columns";
import { getData } from "./data";

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
  // * Main Data Grid Ref
  const gridRef = useRef<AgGridReact>(null);

  // * Column Definitions
  const [colDefs] = useState<ColDef[]>(employeeColumns);

  // * Row Data
  const [rowData] = useState(getData());

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
      width: 168,
      pinned: "left",
      cellRenderer: "agGroupCellRenderer",
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
      enableClickSelection: true,
      groupSelects: "descendants",
    };
  }, []);

  // * Selection Column Definition
  const selectionColumnDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      width: 48,
      suppressHeaderMenuButton: false,
      pinned: "left",
    };
  }, []);

  // * Event Handlers
  const handleOnRowSelected = useCallback((data: any) => {
    // console.log(
    //   "handleOnRowSelected",
    //   data.node.group ? "is group" : "is not group"
    // );
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

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
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
      />
    </div>
  );
};
