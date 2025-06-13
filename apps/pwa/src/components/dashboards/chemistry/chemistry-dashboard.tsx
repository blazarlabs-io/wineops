"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useEffect, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { FormMode, Chemistry } from "@/models/types/db";
import { useChemistry } from "@/context/chemistry";
import ChemistryFormDrawer from "@/components/drawers/chemistry-form-drawer";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import ChemistryTable from "@/components/table/chemistry";

export default function ChemistryDashboard() {
  const [selectionData, setSelectionData] = useState<Chemistry[]>([]);
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

  const { selectedChemistry, chemistry, updateSelectedChemistry } =
    useChemistry();
  const [workingChemistryItem, setWorkingChemistryItem] = useState<
    Chemistry | undefined
  >();
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteChemistryDialog, setOpenDeleteChemistryDialog] =
    useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

  const handleEditChemistry = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteChemistry = async () => {
    setOpenDeleteChemistryDialog(false);

    const res = await db.chemistry.deleteMany(
      user?.uid as string,
      selectedChemistry.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedChemistry([]);

      enqueueSnackbar(`Chemistry item deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting chemistry item`, {
        variant: "error",
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteChemistryDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteChemistryDialog(false);
  };

  useEffect(() => {
    if (selectedChemistry.length > 0 && chemistry.length > 0) {
      const existingChemistryItem = chemistry.find(
        ({ id }) => id === selectedChemistry[0]?.id
      );

      if (!existingChemistryItem) return;

      setFormType("edit");
      setWorkingChemistryItem(existingChemistryItem);
    } else {
      setFormType("create");
      setWorkingChemistryItem(undefined);
    }
  }, [chemistry, selectedChemistry]);

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
        <Typography variant="h4">Chemistry</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedChemistry.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditChemistry,
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

        <ChemistryTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {openFormDrawer && (
          <ChemistryFormDrawer
            type={formType}
            chemistryItem={workingChemistryItem}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="chemistry item"
          entities={selectedChemistry}
          open={openDeleteChemistryDialog}
          onDelete={handleDeleteChemistry}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
