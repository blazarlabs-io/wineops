"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Grape } from "@/models/types/db";
import GrapesTable from "@/components/table/grapes";
import { useGrape } from "@/context/grape";
import grapeBlankSample from "@/data/grape-blank-sample";
import GrapeFormDrawer from "@/components/drawers/grape-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";

export default function GrapesDashboard() {
  const [selectionData, setSelectionData] = useState<Grape[]>([]);
  const { enableGrouping, enableUngrouping, enableDelete } =
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

  const { selectedGrapes, grapes } = useGrape();
  const [workingGrape, setWorkingGrape] = useState(grapeBlankSample);
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteGrapesDialog, setOpenDeleteGrapesDialog] =
    useState<boolean>(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditGrape = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteVineyards = () => {
    setOpenDeleteGrapesDialog(false);

    selectedGrapes.forEach(async (grape) => {
      try {
        await db.grape.deleteOne(user?.uid as string, grape.id);
        enqueueSnackbar(`Deleted ${grape.name} successfully`, {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Error deleting ${grape.name}`, {
          variant: "error",
        });
      }
    });
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteGrapesDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteGrapesDialog(false);
  };

  useEffect(() => {
    if (selectedGrapes.length > 0 && grapes.length > 0) {
      const existingGrape = grapes.find(
        ({ id }) => id === selectedGrapes[0]?.id
      );

      if (!existingGrape) return;

      setFormType("edit");
      setWorkingGrape(existingGrape);
    } else {
      setFormType("create");
      setWorkingGrape(grapeBlankSample);
    }
  }, [grapes, selectedGrapes]);

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
        <Typography variant="h4">Grapes Management</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: true,
              onClick: handleOpenFormDrawer,
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

        <GrapesTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {workingGrape && openFormDrawer && (
          <GrapeFormDrawer
            type={formType}
            grape={workingGrape}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="grape"
          entities={selectedGrapes}
          open={openDeleteGrapesDialog}
          onDelete={handleDeleteVineyards}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
