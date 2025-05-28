import DeleteVineyardsDialog from "@/components/dialogs/delete-vineyards-dialog";
import VineyardFormDrawer from "@/components/drawers/vineyard-form-drawer";
import { useVineyard } from "@/context/vineyard";
import vineyardBlankSample from "@/data/vineyard-blank-sample";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { LabDataSimple, Vineyard } from "@/models/types/db";
import {
  Add,
  DeleteOutline,
  Deselect,
  Edit,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { Search } from "lucide-react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { ButtonType, ButtonProps } from "./constants";
import {
  generateDummyDocs,
  generateLabData,
  generateNotes,
  generateTasks,
} from "@/utils/generators";

export type ToolsBarProps = {
  buttons: Partial<Record<ButtonType, ButtonProps>>;
};

export default function ToolsBar({
  buttons = {
    [ButtonType.ADD]: {
      enabled: true,
    },
  },
}: ToolsBarProps) {
  const { selectedVineyards, vineyards } = useVineyard();

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [openDeleteVineyardsDialog, setOpenDeleteVineyardsDialog] =
    useState<boolean>(false);

  vineyardBlankSample.id = Date.now().toString();
  vineyardBlankSample.labData = generateLabData() as LabDataSimple[];
  vineyardBlankSample.tasks = generateTasks();
  vineyardBlankSample.documents = generateDummyDocs(10);
  vineyardBlankSample.notes = generateNotes();
  vineyardBlankSample.rowType = "item";

  const [localVineyard, setLocalVineyard] =
    useState<Vineyard>(vineyardBlankSample);

  const [workingVineyard, setWorkingVineyard] =
    useState<Vineyard>(vineyardBlankSample);

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = useCallback(() => {
    setOpenFormDrawer(true);
    console.log("[HANDLE OPEN FORM DRAWER]", localVineyard);
  }, [localVineyard]);

  const handleEditVineyards = () => {
    setFormType("edit");
    setOpenFormDrawer(true);
  };

  const handleDeleteVineyards = () => {
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
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteVineyardsDialog(true);
  };

  useEffect(() => {
    if (selectedVineyards.length > 0) {
      setFormType("edit");
      // setLocalVineyard(selectedVineyards[0]);

      if (vineyards && vineyards.length > 0) {
        const _vineyard: Vineyard[] = vineyards.filter(
          (vineyard) => vineyard.id === selectedVineyards[0].id
        );
        console.log("LOCAL VINEYARD", _vineyard[0]);
        setLocalVineyard(() => _vineyard[0]);
      }

      return;
    } else {
      setFormType("create");
      setLocalVineyard(vineyardBlankSample);
    }
  }, [vineyards, selectedVineyards]);

  useEffect(() => {
    if (localVineyard) setWorkingVineyard(localVineyard);
  }, [localVineyard]);

  return (
    <>
      <DeleteVineyardsDialog
        open={openDeleteVineyardsDialog}
        onClose={handleDeleteVineyards}
        vineyards={selectedVineyards}
      />
      <Box
        width={1}
        display="flex"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
      >
        {workingVineyard && openFormDrawer && (
          <VineyardFormDrawer
            type={formType}
            vineyard={workingVineyard}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
        )}
        <Box display="flex" gap={1}>
          {buttons[ButtonType.ADD] && (
            <IconButton
              color="default"
              aria-label="add"
              onClick={handleOpenFormDrawer}
              disabled={
                !buttons[ButtonType.ADD]?.enabled ||
                selectedVineyards.length > 0
              }
            >
              <Add className="" />
            </IconButton>
          )}
          {buttons[ButtonType.EDIT] && (
            <IconButton
              color="default"
              aria-label="edit"
              disabled={!buttons[ButtonType.EDIT]?.enabled}
              onClick={handleEditVineyards}
            >
              <Edit />
            </IconButton>
          )}

          {buttons[ButtonType.GROUP] && (
            <IconButton
              color="default"
              aria-label="group"
              disabled={!buttons[ButtonType.GROUP]?.enabled}
              onClick={buttons[ButtonType.GROUP]?.onClick}
            >
              <SelectAll />
            </IconButton>
          )}

          {buttons[ButtonType.UNGROUP] && (
            <IconButton
              color="default"
              size="small"
              aria-label="ungroup"
              disabled={!buttons[ButtonType.UNGROUP]?.enabled}
              onClick={buttons[ButtonType.UNGROUP]?.onClick}
            >
              <Deselect className="" />
            </IconButton>
          )}

          {buttons[ButtonType.DELETE] && (
            <IconButton
              color="error"
              aria-label="delete"
              disabled={!buttons[ButtonType.DELETE]?.enabled}
              onClick={handleOpenDeleteDialog}
            >
              <DeleteOutline className="" />
            </IconButton>
          )}
        </Box>

        <Box>
          <IconButton
            color="inherit"
            aria-label="filter"
            onClick={() => {}}
            className="ml-auto"
          >
            <Tune />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="filter"
            onClick={() => {}}
            className=""
          >
            <SwapVert />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="filter"
            onClick={() => {}}
            className=""
          >
            <Search />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
