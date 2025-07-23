/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { documentsColumns } from "./columns";
import DocumentsTableToolbar from "./tool-bar";
import Stack from "@mui/material/Stack";
import DeleteUploadedDialog from "@/components/dialogs/delete-uploaded-dialog";

// const VISIBLE_FIELDS = ["name", "rating", "country", "dateCreated", "isAdmin"];

export type DocumentProps = {
  docs?: any[];
  onDocumentUpload?: (data: any) => Promise<void>;
};

export default function DocumentsTable({
  docs,
  onDocumentUpload,
}: DocumentProps) {
  const normalizedDocs = useMemo(
    () =>
      docs?.map(({ id, responsible, ...rest }) => ({
        id: id || crypto.randomUUID(),
        ...rest,
        ownerNameAndEmail: responsible,
      })),
    [docs]
  );

  const columns: GridColDef[] = useMemo(
    () => documentsColumns as GridColDef[],
    []
  );

  return (
    <Box sx={{ height: "300px", width: "100%" }}>
      {columns && (
        <>
          <DataGrid
            loading={!docs}
            rows={normalizedDocs}
            columns={columns}
            slots={{
              toolbar: () => (
                <DocumentsTableToolbar onDocumentUpload={onDocumentUpload} />
              ),
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            slotProps={{
              filterPanel: {
                sx: {},
              },
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            showToolbar
            sx={{
              border: "none",
              overflowY: "auto",
              background: "transparent",
              "& .MuiDataGrid-columnHeaders": {
                background: "var(--mui-palette-background-default)",
                "& *": {
                  background: "transparent",
                },
                "& .MuiDataGrid-row--borderBottom": {
                  background: "transparent",
                },
              },
              "& .MuiDataGrid-columnHeader": {
                background: "var(--mui-palette-background-default)",
                "& *": {
                  background: "transparent",
                },
              },
            }}
          />
        </>
      )}

      {columns &&
        columns.length > 0 &&
        normalizedDocs &&
        normalizedDocs?.length > 0 && <DeleteUploadedDialog />}
    </Box>
  );
}

const CustomNoRowsOverlay = () => (
  <Stack
    sx={{
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    No Documents
  </Stack>
);
