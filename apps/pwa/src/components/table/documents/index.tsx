/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortDocuments } from "@/hooks/use-sort-documents";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { documentsColumns } from "./columns";
import DocumentsTableToolbar from "./tool-bar";

// const VISIBLE_FIELDS = ["name", "rating", "country", "dateCreated", "isAdmin"];

export type DocumentProps = {
  docs: any;
};

export default function DocumentsTable({ docs }: DocumentProps) {
  const { sortedDocs } = useSortDocuments(docs);

  const columns: GridColDef[] = useMemo(
    () => documentsColumns as GridColDef[],
    []
  );

  return (
    <Box sx={{ height: 300, width: "100%" }}>
      {sortedDocs && columns && (
        <DataGrid
          rows={sortedDocs}
          columns={columns}
          slots={{ toolbar: DocumentsTableToolbar }}
          slotProps={{
            filterPanel: {
              sx: {},
            },
          }}
          showToolbar
          style={{
            border: "none",
            overflowY: "auto",
          }}
        />
      )}
    </Box>
  );
}
