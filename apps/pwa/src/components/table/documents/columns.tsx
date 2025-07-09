/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutline, Download, Print } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  ExportPrint,
  GetApplyQuickFilterFn,
  GridColDef,
  GridRenderCellParams,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";

const getApplyQuickFilterFnSameYear: GetApplyQuickFilterFn<any, unknown> = (
  value
) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4-digit string, it cannot be a year so applying this filter is useless
    return null;
  }
  return (cellValue) => {
    if (cellValue instanceof Date) {
      return cellValue.getFullYear() === Number(value);
    }
    return false;
  };
};

export const documentsColumns: GridColDef[] = [
  {
    headerName: "File Name",
    field: "name",
    minWidth: 320,
    renderCell: (params: GridRenderCellParams<any>) => (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="body2" color="textSecondary" className="truncate">
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    headerName: "Document Type",
    field: "type",
    minWidth: 72,
    flex: 1,
  },
  {
    headerName: "Upload Date",
    field: "date",
    minWidth: 164,
    flex: 1,
    getApplyQuickFilterFn: getApplyQuickFilterFnSameYear,
  },
  {
    headerName: "Owner Name & Email",
    field: "ownerNameAndEmail",
    minWidth: 164,
    flex: 1,
  },
  {
    field: "actions",
    headerName: "",
    minWidth: 72,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <div className="flex justify-end items-center w-full h-full">
        <IconButton
          size="small"
          color="default"
          onClick={() => {
            // download file
            console.log("download file", params);
          }}
        >
          <Download className="w-6! h-6!" />
        </IconButton>
        {/* <Toolbar>
          <ExportPrint
            render={
              <ToolbarButton
                render={
                  <Button>
                    <Print className="h-4! w-4! mr-1" />
                    Print
                  </Button>
                }
              />
            }
          />
        </Toolbar> */}
        <IconButton size="small" color="default">
          <DeleteOutline className="w-6! h-6!" />
        </IconButton>
      </div>
    ),
  },
];
