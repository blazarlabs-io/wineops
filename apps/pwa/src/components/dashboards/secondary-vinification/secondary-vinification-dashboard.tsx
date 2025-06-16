"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Bulk } from "@/models/types/db";
import { useBulk } from "@/context/bulk";
import BulkFormDrawer from "@/components/drawers/bulk-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import BulksTable from "@/components/table/bulks";

export default function SecondaryVinificationDashboard() {
  const [selectionData, setSelectionData] = useState<Bulk[]>([]);
  const { enableGrouping, enableUngrouping, enableEdit, enableDelete } =
    useSortToolsBarStates(selectionData);

  const [openGroupingDialog, setOpenGroupingDialog] = useState(false);
  const [openUngroupingDialog, setOpenUngroupingDialog] = useState(false);

  const handleClickOpenGroupingDialog = () => {
    setOpenGroupingDialog(true);
  };

  const handleCloseGroupingDialog = () => {
    setOpenGroupingDialog(false);
  };

  const handleClickOpenUngroupingDialog = () => {
    setOpenUngroupingDialog(true);
  };

  const handleCloseUngroupingDialog = () => {
    setOpenUngroupingDialog(false);
  };

  const { selectedBulks, bulks, updateSelectedBulks } = useBulk();
  const [workingBulk, setWorkingBulk] = useState<Bulk | undefined>();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteBulkDialog, setOpenDeleteBulkDialog] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditBulk = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteBulks = async () => {
    setOpenDeleteBulkDialog(false);

    const res = await db.bulk.deleteMany(
      user?.uid as string,
      selectedBulks.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedBulks([]);

      enqueueSnackbar(`Bulks deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting bulks`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteBulkDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteBulkDialog(false);
  };

  useEffect(() => {
    if (selectedBulks.length > 0 && bulks.length > 0) {
      const existingBulk = bulks.find(({ id }) => id === selectedBulks[0]?.id);

      if (!existingBulk) return;

      setFormType("edit");
      setWorkingBulk(existingBulk);
    } else {
      setFormType("create");
      setWorkingBulk(undefined);
    }
  }, [bulks, selectedBulks]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "left",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4">Secondary Vinification</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedBulks.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditBulk,
            },
            [ButtonType.DELETE]: {
              enabled: enableDelete,
              onClick: handleOpenDeleteDialog,
            },
            [ButtonType.GROUP]: {
              enabled: enableGrouping,
              onClick: handleClickOpenGroupingDialog,
            },
            [ButtonType.UNGROUP]: {
              enabled: enableUngrouping,
              onClick: handleClickOpenUngroupingDialog,
            },
          }}
        />

        <BulksTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <BulkFormDrawer
            type={formType}
            bulk={workingBulk}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="bulk"
          entities={selectedBulks}
          open={openDeleteBulkDialog}
          onDelete={handleDeleteBulks}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
