import { DEFAULT_LOCALE } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { UploadedDocument } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedItemsStore } from "@/store/selected-items";
import formatDate from "@/utils/date-format";
import { DeleteOutline, Download } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import {
  GetApplyQuickFilterFn,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import { getBlob, getStorage, ref } from "firebase/storage";
import { useCallback } from "react";

const getApplyQuickFilterFnSameYear: GetApplyQuickFilterFn<any, unknown> = (
  value,
) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    return null;
  }
  return (cellValue) => {
    if (cellValue instanceof Date) {
      return cellValue.getFullYear() === Number(value);
    }
    return false;
  };
};

const ActionsComponent = (params: GridRenderCellParams) => {
  const { user } = useAuth();

  const setSelected = useSelectedItemsStore((state) => state.setSelectedItems);
  const open = useDialogDrawerStore(({ open }) => open);
  const openDeleteEntityDataDialog = useCallback(
    () => open("delete-entity-data"),
    [open],
  );

  const handleDeleteClick = useCallback(() => {
    setSelected(
      [
        {
          name: params.row?.name,
          row: params.row,
          api: params.api,
        } as UploadedDocument,
      ],
      "document",
    );

    openDeleteEntityDataDialog();
  }, [openDeleteEntityDataDialog, params.api, params.row, setSelected]);

  const handleDownload = useCallback(async () => {
    if (!user?.uid || !params.row) return;

    const { name, type } = params.row;

    if (!name) return;

    const path = type ? type.split(" ").join("-") : "documents";

    if (!path) return;

    const storage = getStorage();
    const fileRef = ref(storage, `${user?.uid}/${path}/${name}`);

    try {
      const blob = await getBlob(fileRef);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {}
  }, [params.row, user?.uid]);

  return (
    <div className="flex justify-end items-center w-full h-full">
      <IconButton size="small" color="default" onClick={handleDownload}>
        <Download className="w-6! h-6!" />
      </IconButton>
      {}
      <IconButton size="small" color="error" onClick={handleDeleteClick}>
        <DeleteOutline className="w-6! h-6!" />
      </IconButton>
    </div>
  );
};

export const documentsColumns: GridColDef[] = [
  {
    headerName: "File Name",
    field: "name",
    minWidth: 220,
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
    minWidth: 100,
    flex: 1,
    getApplyQuickFilterFn: getApplyQuickFilterFnSameYear,
    valueFormatter: (value: Timestamp) =>
      value ? formatDate(value, { locale: DEFAULT_LOCALE }) : "",
  },
  {
    headerName: "Owner Name & Email",
    field: "ownerNameAndEmail",
    minWidth: 200,
    flex: 1,
    renderCell: ({ value }: GridRenderCellParams<any>) => (
      <Stack sx={{ height: "100%", justifyContent: "center" }}>
        <Typography>
          {!value?.name
            ? `${value?.email || ""}`
            : `${value?.name || ""} ${value?.lastName || ""} `}
        </Typography>
        <Typography variant="caption">
          {!value?.name ? value?.id || "" : value?.email || ""}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "actions",
    headerName: "",
    minWidth: 72,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ActionsComponent,
  },
];
