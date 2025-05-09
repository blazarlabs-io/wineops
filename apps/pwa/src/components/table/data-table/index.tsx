/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vineyard } from "@/models/types/db";
import type { ColDef, GetDataPath } from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
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
}

export const DataTable: FunctionComponent<Props> = ({
  gridTheme = "ag-theme-quartz",
  isDarkMode,
}) => {
  const gridRef = useRef<AgGridReact>(null);

  const [colDefs] = useState<ColDef[]>(employeeColumns);

  console.log(getData());

  const [rowData] = useState(getData());
  // const [rowData] = useState(vineyards);
  const getDataPath = useCallback<GetDataPath>((data) => {
    return data.group;
  }, []);

  function myCustomSumFunction(values: any) {
    let sum = 0;
    values.forEach(function (value: any) {
      sum += Number(value);
    });
    return sum;
  }

  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "",
      field: "group",
      width: 168,
      pinned: "left",
      aggFunc: myCustomSumFunction,
      // sort: 'asc',
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        innerRenderer: GroupCellRenderer,
        suppressCount: true,
      },
    };
  }, []);

  const myTheme = themeBalham
    .withParams({
      fontFamily: "lato",
      headerFontFamily: "Lato",
      cellFontFamily: "Lato",
      fontSize: "14px",
      headerFontSize: "14px",
      headerFontWeight: "600",
      headerRowBorder: true,
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

  useEffect(() => {
    console.log("isDarkMode", isDarkMode);
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
      {/* <p style={{ flex: 0 }}>
        <label>
          Dark mode:{" "}
          <input
            type="checkbox"
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </label>
      </p> */}
      <AgGridReact
        masterDetail={true}
        theme={myTheme}
        ref={gridRef}
        columnDefs={colDefs}
        rowData={rowData}
        groupDefaultExpanded={-1}
        getDataPath={getDataPath}
        treeData
        autoGroupColumnDef={autoGroupColumnDef}
      />
    </div>
  );
};
