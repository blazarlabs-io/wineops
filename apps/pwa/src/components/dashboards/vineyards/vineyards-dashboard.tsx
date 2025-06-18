"use client";

import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import VineyardFormDrawer from "@/components/drawers/vineyard-form-drawer";
import VineyardsTable from "@/components/table/vineyards";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useVineyard } from "@/context/vineyard";
import vineyardBlankSample from "@/data/vineyard-blank-sample";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { FormMode, Vineyard } from "@/models/types/db";
import {
  generateDummyDocs,
  generateNotes,
  generateTasks,
} from "@/utils/generators";
import { Box, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

export default function VineyardsDashboard() {
  const [selectionData, setSelectionData] = useState<Vineyard[]>([]);

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

  vineyardBlankSample.id = Date.now().toString();
  vineyardBlankSample.labData = []; //generateLabData() as LabDataSimple[];
  vineyardBlankSample.tasks = [];
  vineyardBlankSample.documents = generateDummyDocs(4);
  vineyardBlankSample.notes = [];
  vineyardBlankSample.rowType = "item";

  const { selectedVineyards, vineyards } = useVineyard();
  const [workingVineyard, setWorkingVineyard] =
    useState<Vineyard>(vineyardBlankSample);
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteVineyardsDialog, setOpenDeleteVineyardsDialog] =
    useState<boolean>(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = useCallback(() => {
    setOpenFormDrawer(true);
  }, []);

  const handleEditVineyards = useCallback(() => {
    setFormType("edit");
    setOpenFormDrawer(true);
  }, []);

  const handleDeleteVineyards = useCallback(() => {
    setOpenDeleteVineyardsDialog(false);

    selectedVineyards.forEach(async (vineyard) => {
      try {
        await db.vineyard.deleteOne(user?.uid as string, vineyard.id);
        enqueueSnackbar(`Deleted ${vineyard.name} successfully`, {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Error deleting ${vineyard.name}`, {
          variant: "error",
        });
      }
    });
  }, [enqueueSnackbar, selectedVineyards, user?.uid]);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteVineyardsDialog(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteVineyardsDialog(true);
  };

  useEffect(() => {
    if (selectedVineyards.length > 0 && vineyards.length > 0) {
      const existingVineyard = vineyards.find(
        ({ id }) => id === selectedVineyards[0]?.id
      );

      if (!existingVineyard) return;

      setFormType("edit");
      setWorkingVineyard(existingVineyard);
      console.log("WORKING VINEYARD", workingVineyard);
    } else {
      setFormType("create");
      setWorkingVineyard(vineyardBlankSample);
      console.log("WORKING VINEYARD", workingVineyard);
    }
  }, [vineyards, selectedVineyards]);

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
        <Typography variant="h4">Vineyards Management</Typography>

        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: selectedVineyards.length === 0,
              onClick: handleOpenFormDrawer,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
              onClick: handleEditVineyards,
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

        <VineyardsTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />

        {workingVineyard && openFormDrawer && (
          <VineyardFormDrawer
            type={formType}
            vineyard={workingVineyard}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}

        <DeleteEntitiesDialog
          entityName="vineyard"
          entities={selectedVineyards}
          open={openDeleteVineyardsDialog}
          onDelete={handleDeleteVineyards}
          onClose={handleCloseDeleteDialog}
        />
      </Stack>
    </Box>
  );
}
