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
import { ButtonType, ButtonProps } from "./constants";

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
  return (
    <>
      <Box
        width={1}
        display="flex"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap={1}>
          {buttons[ButtonType.ADD] && (
            <IconButton
              color="default"
              aria-label="add"
              onClick={buttons[ButtonType.ADD]?.onClick}
              disabled={!buttons[ButtonType.ADD]?.enabled}
            >
              <Add className="" />
            </IconButton>
          )}
          {buttons[ButtonType.EDIT] && (
            <IconButton
              color="default"
              aria-label="edit"
              disabled={!buttons[ButtonType.EDIT]?.enabled}
              onClick={buttons[ButtonType.EDIT]?.onClick}
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
              onClick={buttons[ButtonType.DELETE]?.onClick}
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
