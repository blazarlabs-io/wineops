"use client";

import { useColorScheme } from "@mui/material";
import { DataTable } from "@/components/table/data-table";
import { Grape } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { grapesColumns } from "./columns";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useGrape } from "@/context/grape";
import { db } from "@/lib/firebase/services";
// import { SelectionCellRenderer } from "./SelectionCellRenderer";

interface GrapesTableProps {
  onChangeData?: (data: Grape[]) => void;
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

  const normalizeGrapes = useMemo(
    () =>
      grapes.map((grape) => ({
        ...grape,
        batchId: {
          name: grape?.name,
          grapeVariety: grape?.grapeVariety,
          certifications: grape?.certifications,
          date: grape?.date,
          location: grape?.location,
          status: grape?.status,
        },
        metrics: { ...grape.metrics, status: grape.status },
      })),
    [grapes]
  );

  const updateGroup = async (
    uid: string,
    rows: Partial<Grape>[],
    group: string[]
  ) => await db.grape.updateGroup(uid, rows, group);

  return (
    <StrictMode>
      <DataTable<Grape>
        isDarkMode={mode === "dark"}
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizeGrapes}
        columns={grapesColumns}
        // selectionCellRenderer={SelectionCellRenderer}
        groupColumnDef={{
          headerName: "Batch Entry",
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedGrapes}
      />
    </StrictMode>
  );
}
