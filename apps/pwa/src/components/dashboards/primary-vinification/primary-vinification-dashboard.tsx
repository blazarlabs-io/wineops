"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Must } from "@/models/types/db";
import { useMust } from "@/context/must";
import MustFormDrawer from "@/components/drawers/must-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import MustsTable from "@/components/table/musts";

export default function PrimaryVinificationDashboard() {
  const [selectionData, setSelectionData] = useState<Must[]>([]);
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

  const { selectedMusts, musts, updateSelectedMusts } = useMust();
  const [workingMust, setWorkingMust] = useState<Must | undefined>();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteMustDialog, setOpenDeleteMustDialog] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditMust = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteMusts = async () => {
    setOpenDeleteMustDialog(false);

    const res = await db.must.deleteMany(
      user?.uid as string,
      selectedMusts.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedMusts([]);

      enqueueSnackbar(`Musts deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting musts`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteMustDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteMustDialog(false);
  };

  useEffect(() => {
    if (selectedMusts.length > 0 && musts.length > 0) {
      const existingMust = musts.find(({ id }) => id === selectedMusts[0]?.id);

      if (!existingMust) return;

      setFormType("edit");
      setWorkingMust(existingMust);
    } else {
      setFormType("create");
      setWorkingMust(undefined);
    }
  }, [musts, selectedMusts]);

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
        <Typography variant="h4">Primary Vinification</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedMusts.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditMust,
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

        <MustsTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <MustFormDrawer
            type={formType}
            must={workingMust}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="must"
          entities={selectedMusts}
          open={openDeleteMustDialog}
          onDelete={handleDeleteMusts}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
