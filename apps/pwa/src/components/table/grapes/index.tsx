"use client";

import { useColorScheme } from "@mui/material";
import { DataTable } from "@/components/table/data-table";
import { Grape } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { grapesColumns } from "./columns";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useGrape } from "@/context/grape";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
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

  const normalizedGrapes = useMemo(
    () =>
      grapes.map((grape) => ({
        ...grape,
        ...(grape.rowType !== "group" && {
          batchId: {
            name: grape?.name,
            grapeVariety: grape?.grapeVariety,
            certifications: grape?.certifications,
            date: grape?.date,
            location: grape?.location,
            status: grape?.status,
          },
          metrics: { ...grape.metrics, status: grape.status },
        }),
        group:
          !grape?.group ||
          grape?.group?.length === 0 ||
          (grape?.group?.length === 1 &&
            grape.name &&
            grape.rowType !== "group" &&
            grape?.group[0] !== grape.name)
            ? [grape?.name]
            : grape.group,
      })),
    [grapes]
  );

  const updateGroup = async (uid: string, rows: Partial<Grape>[]) =>
    await db.grape.updateGroup(uid, rows);

  const createGroup = async (uid: string, group: Partial<Grape>) =>
    await db.grape.create(uid, group);

  return (
    <StrictMode>
      <DataTable<Grape>
        isDarkMode={mode === "dark"}
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedGrapes}
        columns={grapesColumns}
        // selectionCellRenderer={SelectionCellRenderer}
        groupColumnDef={{
          headerName: "Batch Entry",
          rowDrag: true,
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
          cellRenderer: "agGroupCellRenderer",
          width: GROUP_COLUMN_WIDTH,
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedGrapes}
        createGroup={createGroup}
      />
    </StrictMode>
  );
}
