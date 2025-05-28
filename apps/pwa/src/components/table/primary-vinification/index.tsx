/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DataTable } from "@/components/table/data-table";
import { useGrape } from "@/context/grape";
import { mustDataSample } from "@/data/must-data-sample";
import { db } from "@/lib/firebase/services";
import { Must } from "@/models/types/db";
import { useColorScheme } from "@mui/material";
import { StrictMode, useMemo } from "react";
import { mustColumns } from "./columns";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { SelectionCellRenderer } from "./SelectionCellRenderer";

interface GrapesTableProps {
  onChangeData?: (data: Must[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function GrapesTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: GrapesTableProps) {
  const { mode } = useColorScheme();
  const { grapes, updateSelectedGrapes } = useGrape();

  const normalizeMusts = useMemo(
    () =>
      mustDataSample.map((must) => ({
        ...must,
      })),
    [mustDataSample]
  );

  const updateSelectedMusts = (data: Must[]) => {};

  const updateGroup = async (
    uid: string,
    rows: Partial<Must>[],
    group: string[]
  ) => await db.grape.updateGroup(uid, rows, group);

  return (
    <StrictMode>
      {/* <DataTable<Must>
        isDarkMode={mode === "dark"}
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizeMusts}
        columns={mustColumns}
        selectionCellRenderer={SelectionCellRenderer}
        groupColumnDef={{
          headerName: "Batch Entry",
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedMusts}
      /> */}
    </StrictMode>
  );
}
