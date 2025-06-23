import {
  Add,
  DeleteOutline,
  Deselect,
  Edit,
  FormatListBulleted,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { Search } from "lucide-react";
import { ButtonType, ButtonProps } from "./constants";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { useQuickDrawer } from "@/context/quick-drawer";
import { QuickDrawerType } from "@/models/types/db";
import { useColorScheme } from "@mui/material";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useDialogDrawerStore } from "@/store/dialogs";

const ALL_BUTTONS: Record<ButtonType, ButtonProps> = {
  [ButtonType.ADD]: {
    enabled: false,
  },
  [ButtonType.EDIT]: {
    enabled: false,
  },
  [ButtonType.GROUP]: {
    enabled: false,
  },
  [ButtonType.UNGROUP]: {
    enabled: false,
  },
  [ButtonType.DELETE]: {
    enabled: false,
  },
};

export type ToolsBarProps = {
  buttons?: Partial<Record<ButtonType, ButtonProps>>;
};

export default function ToolsBar(props: ToolsBarProps) {
  const { mode } = useColorScheme();
  const { updateOpen, updateType } = useQuickDrawer();

  const buttons = props.buttons || ALL_BUTTONS;

  const {
    enableAdd,
    enableGrouping,
    enableUngrouping,
    enableEdit,
    enableDelete,
  } = useSortToolsBarStates();

  const { openDialog } = useDialogDrawerStore((state) => state);
  const openGroupingDialog = () => openDialog("group-entities");
  const openUngroupingDialog = () => openDialog("ungroup-entities");
  const openDeleteDialog = () => openDialog("delete-entities");
  const openFormDrawer = () => openDialog("form-drawer");

  const handleOpenDrawer = (type: string) => {
    updateOpen(true);
    updateType(type as QuickDrawerType);
  };
  return (
    <>
      <Box
        width={1}
        display="flex"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap={1}>
          {buttons[ButtonType.ADD] && (
            <IconButton
              color="default"
              aria-label="add"
              onClick={buttons[ButtonType.ADD]?.onClick || openFormDrawer}
              disabled={!(buttons[ButtonType.ADD]?.enabled || enableAdd)}
            >
              <Add className="" />
            </IconButton>
          )}
          {buttons[ButtonType.EDIT] && (
            <IconButton
              color="default"
              aria-label="edit"
              disabled={!(buttons[ButtonType.EDIT]?.enabled || enableEdit)}
              onClick={buttons[ButtonType.EDIT]?.onClick || openFormDrawer}
            >
              <Edit />
            </IconButton>
          )}

          {buttons[ButtonType.GROUP] && (
            <IconButton
              color="default"
              aria-label="group"
              disabled={!(buttons[ButtonType.GROUP]?.enabled || enableGrouping)}
              onClick={buttons[ButtonType.GROUP]?.onClick || openGroupingDialog}
            >
              <SelectAll />
            </IconButton>
          )}

          {buttons[ButtonType.UNGROUP] && (
            <IconButton
              color="default"
              size="small"
              aria-label="ungroup"
              disabled={
                !(buttons[ButtonType.UNGROUP]?.enabled || enableUngrouping)
              }
              onClick={
                buttons[ButtonType.UNGROUP]?.onClick || openUngroupingDialog
              }
            >
              <Deselect className="" />
            </IconButton>
          )}

          {buttons[ButtonType.DELETE] && (
            <IconButton
              color="error"
              aria-label="delete"
              disabled={!(buttons[ButtonType.DELETE]?.enabled || enableDelete)}
              onClick={buttons[ButtonType.DELETE]?.onClick || openDeleteDialog}
            >
              <DeleteOutline className="" />
            </IconButton>
          )}
        </Box>

        <Stack direction="row" gap={1} alignItems={"center"}>
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            <IconButton
              color="inherit"
              aria-label="filter"
              onClick={() => {}}
              className="ml-auto"
              disabled
            >
              <Tune />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="filter"
              onClick={() => {}}
              className=""
              disabled
            >
              <SwapVert />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="filter"
              onClick={() => {}}
              className=""
              disabled
            >
              <Search />
            </IconButton>
          </Box>
          <div
            className="w-[1px] h-6"
            style={{
              backgroundColor: "var(--mui-palette-divider)",
            }}
          />
          <Box
            flexDirection={"row"}
            display={"flex"}
            alignItems={"center"}
            minWidth={"fit-content"}
            maxWidth={"fit-content"}
            gap={1}
            className="pointer-events-auto"
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // edge="end"
              onClick={() => handleOpenDrawer("tasks")}
              className=""
            >
              <FormatListBulleted />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // edge="end"
              onClick={() => handleOpenDrawer("actions")}
              style={{
                backgroundColor: mode === "dark" ? "transparent" : "#333",
              }}
            >
              <QuickActionsIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
