"use client";

import { DataTable } from "@/components/table/data-table";
import { Grape } from "@/models/types/db";
import { useMemo } from "react";
import { grapesColumns } from "./columns";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useGrape } from "@/context/grape";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";

export default function GrapesTable() {
  const { grapes } = useGrape();

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
          (grape?.group?.length > 0 &&
            grape.name &&
            grape.rowType !== "group" &&
            grape?.group[grape?.group.length - 1] !== grape.name)
            ? [...grape?.group.slice(0, -1), grape?.name]
            : grape?.group,
      })),
    [grapes]
  );

  return (
    <DataTable<Grape>
      data={normalizedGrapes}
      columns={grapesColumns}
      groupColumnDef={{
        headerName: "Batch Entry",
        rowDrag: true,
        cellRendererParams: {
          innerRenderer: GroupCellRenderer,
          suppressCount: true,
        },
        cellRenderer: "agGroupCellRenderer",
        width: GROUP_COLUMN_WIDTH,
        lockPinned: true,
        lockPosition: true,
        suppressMovable: true,
      }}
      groupByButtons={[
        { name: "Date", columnName: "groupByDate" },
        { name: "Variety", columnName: "groupByVariety" },
      ]}
      entityName="grape"
    />
  );
}
