"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Consumable } from "@/models/types/db";
import { useConsumable } from "@/context/consumable";
import ConsumableFormDrawer from "@/components/drawers/consumable-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import ConsumablesTable from "@/components/table/consumables";

export default function ConsumablesDashboard() {
  const [selectionData, setSelectionData] = useState<Consumable[]>([]);
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

  const { selectedConsumables, consumables, updateSelectedConsumables } =
    useConsumable();
  const [workingConsumable, setWorkingConsumable] = useState<
    Consumable | undefined
  >();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteConsumableDialog, setOpenDeleteConsumableDialog] =
    useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditConsumable = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteConsumables = async () => {
    setOpenDeleteConsumableDialog(false);

    const res = await db.consumable.deleteMany(
      user?.uid as string,
      selectedConsumables.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedConsumables([]);

      enqueueSnackbar(`Consumables deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting consumables`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteConsumableDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteConsumableDialog(false);
  };

  useEffect(() => {
    if (selectedConsumables.length > 0 && consumables.length > 0) {
      const existingConsumable = consumables.find(
        ({ id }) => id === selectedConsumables[0]?.id
      );

      if (!existingConsumable) return;

      setFormType("edit");
      setWorkingConsumable(existingConsumable);
    } else {
      setFormType("create");
      setWorkingConsumable(undefined);
    }
  }, [consumables, selectedConsumables]);

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
        <Typography variant="h4">Consumables</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedConsumables.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditConsumable,
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

        <ConsumablesTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <ConsumableFormDrawer
            type={formType}
            consumable={workingConsumable}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="consumable"
          entities={selectedConsumables}
          open={openDeleteConsumableDialog}
          onDelete={handleDeleteConsumables}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
