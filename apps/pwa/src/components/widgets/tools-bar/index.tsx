import DeleteVineyardsDialog from "@/components/dialogs/delete-vineyards-dialog";
import VineyardFormDrawer from "@/components/drawers/vineyard-form-drawer";
import { useVineyard } from "@/context/vineyard";
import vineyardBlankSample from "@/data/vineyard-blank-sample";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { Vineyard } from "@/models/types/db";
import {
  Add,
  DeleteOutline,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { Box, Fab, IconButton } from "@mui/material";
import { EditIcon, Search } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import DeselectIcon from "@mui/icons-material/Deselect";
import Tooltip from "@mui/material/Tooltip";
import VineyardMenu from "./vineyard-menu";
import GroupingMenu from "./grouping-menu";

export type ToolsBarProps = {
  enableCreate: boolean;
  enableEdit: boolean;
  enableGrouping: boolean;
  enableDelete: boolean;
  enableUngrouping: boolean;
  onClickGroup: () => void;
  onClickUngroup: () => void;
};

export default function ToolsBar({
  enableCreate = true,
  enableEdit,
  enableGrouping,
  enableDelete,
  enableUngrouping,
  onClickGroup,
  onClickUngroup,
}: ToolsBarProps) {
  const { selectedVineyards } = useVineyard();

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [openDeleteVineyardsDialog, setOpenDeleteVineyardsDialog] =
    useState<boolean>(false);
  const [localVineyard, setLocalVineyard] =
    useState<Vineyard>(vineyardBlankSample);

  const handleCloseFormDrawer = () => {
    setOpenFormDrawer(false);
  };

  const handleOpenFormDrawer = () => {
    setOpenFormDrawer(true);
  };

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
      setLocalVineyard(selectedVineyards[0]);
    } else {
      setFormType("create");
      setLocalVineyard(vineyardBlankSample);
    }
  }, [selectedVineyards]);

  return (
    <>
      <DeleteVineyardsDialog
        open={openDeleteVineyardsDialog}
        onClose={handleDeleteVineyards}
        vineyards={selectedVineyards}
      />
      <Box className="flex items-center w-full">
        <VineyardMenu />
        <GroupingMenu />
        {/* <Box
          width={"100%"}
          display={"flex"}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
          className=""
        >
          <VineyardFormDrawer
            type={formType}
            vineyard={localVineyard}
            open={openFormDrawer}
            onClose={handleCloseFormDrawer}
          />
          <Fab
            color="primary"
            size="small"
            aria-label="add"
            className="shadow-xs"
            sx={{
              minWidth: "40px",
            }}
            onClick={handleOpenFormDrawer}
            disabled={!enableCreate}
          >
            <Add className="" />
          </Fab>
          <Fab
            color="primary"
            size="small"
            aria-label="edit"
            className="shadow-xs"
            sx={{
              minWidth: "40px",
            }}
            disabled={!enableEdit}
            onClick={handleEditVineyards}
          >
            <EditIcon className="w-[18px] h-[18px]" />
          </Fab>
          <Tooltip title="Add to group" arrow>
            <Fab
              color="primary"
              size="small"
              aria-label="group"
              className="shadow-xs"
              sx={{
                minWidth: "40px",
              }}
              disabled={!enableGrouping}
              onClick={onClickGroup}
            >
              <SelectAll className="" />
            </Fab>
          </Tooltip>

          <Tooltip title="Ungroup" arrow>
            <Fab
              color="primary"
              size="small"
              aria-label="ungroup"
              className="shadow-xs"
              sx={{
                minWidth: "40px",
              }}
              disabled={!enableUngrouping}
              onClick={onClickUngroup}
            >
              <DeselectIcon className="" />
            </Fab>
          </Tooltip>
          <Fab
            color="error"
            size="small"
            aria-label="add"
            className="shadow-xs"
            sx={{
              minWidth: "40px",
            }}
            disabled={!enableDelete}
            onClick={handleOpenDeleteDialog}
          >
            <DeleteOutline className="" />
          </Fab>

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
        </Box> */}
      </Box>
    </>
  );
}
