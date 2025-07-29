
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IRowNode,
  RowSelectionOptions,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeBalham,
} from "ag-grid-community";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useColorScheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { Anexa14GridData, columns } from "./columns";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useWinery } from "@/context/winery";
import { useAnexa14List } from "@/context/anexa14";
import { TeamMember } from "@/models/types/db";

ModuleRegistry.registerModules([AllCommunityModule]);

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  headerCheckbox: false,
};

const Anexa14Table = () => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [rowHeight] = useState(ROW_HEIGHT_DEFAULT / 1.5);

  const [colDefs] = useState<ColDef[]>(columns);

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

  const defaultColDef = useMemo<ColDef>(() => {
    return {};
  }, []);

  const { anexa14List } = useAnexa14List();
  const { teamMembers } = useWinery();

  const setSelected = useSelectedEntitiesStore((state) => state.setSelected);

  const handleSelectionChanged = useCallback(
    (data: any) => {
      setSelected(data.api.getSelectedRows(), "anexa14");
    },
    [setSelected]
  );

  useEffect(() => {
    document.body.dataset.agThemeMode = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const getUser = useCallback(
    (user: TeamMember["id"] | TeamMember["email"]) =>
      teamMembers.find(
        ({ id, email }) =>
          user === id || user?.toLowerCase() === email?.toLowerCase()
      ) ||
      (user.includes("@")
        ? { email: user.includes("@") ? user : "" }
        : { id: user }),
    [teamMembers]
  );

  const { selected, entityName } = useSelectedEntitiesStore((state) => state);

  const normalizedAnexa14List = useMemo(
    () =>
      anexa14List.map(({ createdBy, modifiedBy, ...report }) => ({
        ...report,
        createdByUser: getUser(createdBy),
        modifiedByUser: modifiedBy ? getUser(modifiedBy) : "",
      })),
    [anexa14List, getUser]
  );

  const selectedIds = useMemo(() => selected.map(({ id }) => id), [selected]);

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      if (entityName !== "anexa14" || selectedIds.length === 0) return;

      const gridApi: GridApi = params.api;

      gridApi.forEachNode((node: IRowNode<Anexa14GridData>) => {
        if (node.data?.id && selectedIds.includes(node.data?.id)) {
          node.setSelected(true);
        }
      });
    },
    [entityName, selectedIds]
  );

  useEffect(() => {
    return () => {
      setSelected([]);
    };
  }, [setSelected]);

  return (
    <div className={`${themeClass} w-full h-[calc(100vh-212px)]`}>
      <AgGridReact
        theme={myTheme}
        rowData={normalizedAnexa14List}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection={rowSelection}
        onSelectionChanged={handleSelectionChanged}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default Anexa14Table;
