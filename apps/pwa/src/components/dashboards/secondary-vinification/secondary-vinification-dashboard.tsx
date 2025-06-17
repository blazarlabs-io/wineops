"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Wine } from "@/models/types/db";
import { useWine } from "@/context/wine";
import WineFormDrawer from "@/components/drawers/wine-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import WinesTable from "@/components/table/wines";

export default function SecondaryVinificationDashboard() {
  const [selectionData, setSelectionData] = useState<Wine[]>([]);
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

  const { selectedWines, wines, updateSelectedWines } = useWine();
  const [workingWine, setWorkingWine] = useState<Wine | undefined>();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteWineDialog, setOpenDeleteWineDialog] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditWine = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteWines = async () => {
    setOpenDeleteWineDialog(false);

    const res = await db.wine.deleteMany(
      user?.uid as string,
      selectedWines.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedWines([]);

      enqueueSnackbar(`Wines deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting wines`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteWineDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteWineDialog(false);
  };

  useEffect(() => {
    if (selectedWines.length > 0 && wines.length > 0) {
      const existingWine = wines.find(({ id }) => id === selectedWines[0]?.id);

      if (!existingWine) return;

      setFormType("edit");
      setWorkingWine(existingWine);
    } else {
      setFormType("create");
      setWorkingWine(undefined);
    }
  }, [wines, selectedWines]);

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
              enabled: selectedWines.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditWine,
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

        <WinesTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <WineFormDrawer
            type={formType}
            wine={workingWine}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="wine"
          entities={selectedWines}
          open={openDeleteWineDialog}
          onDelete={handleDeleteWines}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
