"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Vessel } from "@/models/types/db";
import VesselTable from "@/components/table/vessel";
import { useVessel } from "@/context/vessel";
import VesselFormDrawer from "@/components/drawers/vessel-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";

export default function VesselsDashboard() {
  const [selectionData, setSelectionData] = useState<Vessel[]>([]);
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

  const { selectedVessels, vessels, updateSelectedVessels } = useVessel();
  const [workingVessel, setWorkingVessel] = useState<Vessel | undefined>();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteVesselDialog, setOpenDeleteVesselDialog] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditVessel = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteVessels = async () => {
    setOpenDeleteVesselDialog(false);

    const res = await db.vessel.deleteMany(
      user?.uid as string,
      selectedVessels.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedVessels([]);

      enqueueSnackbar(`Vessels deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting vessels`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteVesselDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteVesselDialog(false);
  };

  useEffect(() => {
    if (selectedVessels.length > 0 && vessels.length > 0) {
      const existingVessel = vessels.find(
        ({ id }) => id === selectedVessels[0]?.id
      );

      if (!existingVessel) return;

      setFormType("edit");
      setWorkingVessel(existingVessel);
    } else {
      setFormType("create");
      setWorkingVessel(undefined);
    }
  }, [vessels, selectedVessels]);

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
        <Typography variant="h4">Vessel Management</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedVessels.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditVessel,
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

        <VesselTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <VesselFormDrawer
            type={formType}
            vessel={workingVessel}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="vessel"
          entities={selectedVessels}
          open={openDeleteVesselDialog}
          onDelete={handleDeleteVessels}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
