/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ClientSideRowModelModule,
  ColDef,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  CellSpanModule,
  CellStyleModule,
  CustomEditorModule,
  themeBalham,
  SelectionChangedEvent,
  IRowNode,
  RowSelectionOptions,
  RowSelectionModule,
} from "ag-grid-community";
import { TreeDataModule, RichSelectModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getData } from "./data";
import { Vineyard } from "@/models/types/db";
import { vineyardColumns } from "./columns";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
import { useVineyard } from "@/context/vineyard";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  TextFilterModule,
  CellSpanModule,
  CellStyleModule,
  CustomEditorModule,
  RichSelectModule,
  RowSelectionModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
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

export default function GroupableDataTable({
  gridTheme = "ag-theme-quartz",
  isDarkMode,
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: Props) {
  const { vineyards, updateSelectedVineyards } = useVineyard();
  const [selectedRows, setSelectedRows] = useState<IRowNode[]>([]);
  const [rowHeight] = useState(80);
  const [expandedRowHeight] = useState(364);
  const [columnDefs] = useState<ColDef[]>(vineyardColumns);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: "group",
      minWidth: 280,
      filter: "agTextColumnFilter",
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: any) => {
          console.log("XYZXYZ", params.node.data);
          return (
            <>
              {!params.node.group && params.node.data ? (
                <div
                  style={{
                    height: expandedRowHeight,
                    backgroundColor: "var(--mui-palette-background-default)",
                  }}
                  className="absolute left-0 top-0 w-full flex items-center justify-center"
                >
                  <VineyardDetailsWidget vineyard={params.node.data} />
                </div>
              ) : (
                params.value
              )}
            </>
          );
        },
      },
      cellRenderer: "agGroupCellRenderer",
      colSpan: (params: any) => {
        // console.log("colSpan", params.api.getColumns());
        if (params.node.group) {
          return 1;
        } else {
          // return the length of all columns
          return columnDefs.length + 1;
        }
      },
    };
  }, []);

  const getRowHeight = useCallback(
    (params: any) => {
      console.log("params", params);
      if (params.data) {
        return expandedRowHeight;
      } else {
        return rowHeight;
      }
    },
    [rowHeight]
  );

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
      setSelectedRows(selectedNodes);
    },
    []
  );

  const data = getData();

  const getDataPath = useCallback((data: any) => data.group, []);

  const normalizedData: Vineyard[] = useMemo(
    () =>
      data.map((row: Vineyard) => ({
        ...row,
        group:
          !row.group || row.group.length < 2 ? [row.id ?? row.name] : row.group,
      })),
    [data]
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
      {normalizedData.length > 0 && (
        <AgGridReact
          theme={myTheme}
          rowData={normalizedData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          onSelectionChanged={handleOnSelectionChanged}
          getDataPath={getDataPath}
          getRowHeight={getRowHeight}
          selectionColumnDef={selectionColumnDef as ColDef}
          rowSelection={rowSelection as RowSelectionOptions}
          onRowSelected={handleOnRowSelected}
        />
      )}
    </div>
  );
}
