/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED } from "@/data/constants";
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
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { columns, potentialParent, setPotentialParentForNode } from "./config";
import { getData } from "./data";
import { IFile, moveFiles } from "./fileUtils";
import GroupCellRenderer from "./group-cell-renderer";
import "./style.css";
import { nodesToVineyards } from "@/utils/convert-node-to-vineyard";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  RenderApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  TreeDataModule,
  RowSelectionModule,
  PinnedRowModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

interface BaseTableProps {
  gridTheme?: string;
  isDarkMode?: boolean;
  pinnedRows?: any;
  onRowSelection?: (rows: any) => void;
}

export default function BaseTable({
  gridTheme = "ag-theme-quartz",
  isDarkMode = false,
  pinnedRows,
  onRowSelection,
}: BaseTableProps) {
  const gridRef = useRef<AgGridReact<IFile>>(null);
  const [rowData] = useState<IFile[]>(getData());
  const [columnDefs] = useState<ColDef[]>(columns);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  // * DATA PATH
  const getDataPath = useCallback((data: IFile) => data.filePath, []);

  // * ROW ID
  const getRowId = useCallback(({ data }: { data: IFile }) => data.id, []);

  // * AUTO GROUP COLUMN
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      rowDrag: true,
      headerName: "Name",
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
    // clear node to highlight
    setPotentialParentForNode(event.api, null);
  }, []);

  const onRowDragEnd = useCallback(
    (event: RowDragEndEvent) => {
      const target = event.overNode?.data;
      if (!potentialParent && target) {
        return; // no move
      }
      const source = event.node.data;
      const rowData = event.api.getGridOption("rowData");
      if (rowData && source && source !== target) {
        const newRowData = moveFiles(rowData, source, target);
        if (!newRowData) {
          console.log("invalid move");
        } else if (newRowData !== rowData) {
          event.api.setGridOption("rowData", newRowData);
        }
        gridRef.current!.api.clearFocusedCell();
      }
      // clear node to highlight
      setPotentialParentForNode(event.api, null);
    },
    [moveFiles]
  );

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

  // * DEFINE PINNED ROWS
  const pinnedTopRowData = useMemo(() => {
    return pinnedRows;
  }, [pinnedRows]);

  // const [pinnedTopRowData, setPinnedTopRowData] = useState<any>();

  // useEffect(() => {
  //   setPinnedTopRowData(pinnedRows);
  // }, [pinnedRows]);

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

  // const selectionColumnDef = useMemo<ColDef>(() => {
  //   return {
  //     headerName: "XXX",
  //     field: "selection",
  //     sortable: false,
  //     resizable: true,
  //     width: 48,
  //     suppressHeaderMenuButton: true,
  //     pinned: "left",
  //     cellRenderer: "agGroupCellRenderer",
  //     // cellRendererParams: {
  //     //   checkbox: true,
  //     // },
  //   };
  // }, []);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-180px)]`}>
      <AgGridReact
        ref={gridRef}
        theme={myTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        treeData={true}
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
        // selectionColumnDef={selectionColumnDef}
      />
    </div>
  );
}
