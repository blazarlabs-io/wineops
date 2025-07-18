/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// React Grid Logic
import { useCallback, useEffect, useMemo, useState } from "react";

// Theme
import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeBalham,
} from "ag-grid-community";
// Core CSS
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useColorScheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { columns } from "./columns";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useWinery } from "@/context/winery";

ModuleRegistry.registerModules([AllCommunityModule]);

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  headerCheckbox: false,
};

const TeamTable = () => {
  const { mode } = useColorScheme();
  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT / 1.5);

  const isDarkMode = mode === "dark";

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState<ColDef[]>(columns);

  // * Theming
  const themeClass = isDarkMode ? `ag-theme-quartz-dark` : `ag-theme-quartz`;
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

  // Apply settings across all columns
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      //   filter: true,
      //   editable: true,
    };
  }, []);

  const { teamMembers } = useWinery();
  const setSelected = useSelectedEntitiesStore((state) => state.setSelected);

  const handleRowSelection = useCallback(
    (data: any) => {
      setSelected(data.api.getSelectedRows(), "team");
    },
    [setSelected]
  );

  // * Change GRID Theme Mode on Mount
  useEffect(() => {
    if (isDarkMode) {
      document.body.dataset.agThemeMode = "dark";
    } else {
      document.body.dataset.agThemeMode = "light";
    }
  }, [isDarkMode]);

  useEffect(() => {
    return () => {
      setSelected([]);
    };
  }, [setSelected]);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-212px)]`}>
      <AgGridReact
        theme={myTheme}
        rowData={teamMembers}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection={rowSelection}
        onSelectionChanged={handleRowSelection}
      />
    </div>
  );
};

export default TeamTable;
