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
  Deselect,
  Edit,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { Search } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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
        <Box
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
          <IconButton
            color="default"
            aria-label="add"
            onClick={handleOpenFormDrawer}
            disabled={!enableCreate}
          >
            <Add className="" />
          </IconButton>
          <IconButton
            color="default"
            aria-label="edit"
            disabled={!enableEdit}
            onClick={handleEditVineyards}
          >
            <Edit />
          </IconButton>
          {/* <Tooltip title="Add to group" arrow> */}
          <IconButton
            color="default"
            aria-label="group"
            disabled={!enableGrouping}
            onClick={onClickGroup}
          >
            <SelectAll />
          </IconButton>
          {/* </Tooltip> */}

          {/* <Tooltip title="Ungroup" arrow> */}
          <IconButton
            color="default"
            size="small"
            aria-label="ungroup"
            className="shadow-xs"
            sx={{
              minWidth: "40px",
            }}
            disabled={!enableUngrouping}
            onClick={onClickUngroup}
          >
            <Deselect className="" />
          </IconButton>
          {/* </Tooltip> */}
          <IconButton
            color="default"
            aria-label="delete"
            disabled={!enableDelete}
            onClick={handleOpenDeleteDialog}
          >
            <DeleteOutline className="" />
          </IconButton>

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
          {/* </Box> */}
        </Box>
      </Box>
    </>
  );
}
