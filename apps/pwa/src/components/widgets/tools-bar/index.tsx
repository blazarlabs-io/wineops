import {
  Add,
  DeleteOutline,
  Deselect,
  Edit,
  FormatListBulleted,
  PivotTableChartOutlined,
  PushPinOutlined,
  SelectAll,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import { Box, IconButton, ListItemText, Stack } from "@mui/material";
import { Search } from "lucide-react";
import { ButtonType, ButtonProps } from "./constants";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { useQuickDrawer } from "@/context/quick-drawer";
import { QuickDrawerType } from "@/models/types/db";
import { useColorScheme } from "@mui/material";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useDialogDrawerStore } from "@/store/dialogs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";
import { useGridStore } from "@/store/grid";
import { GroupBy } from "@/models/types/dashboard";

const ALL_BUTTONS: Record<ButtonType, ButtonProps> = {
  [ButtonType.ADD]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.EDIT]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.GROUP]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.PIN]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.PIVOT]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.UNGROUP]: {
    enabled: false,
    hide: false,
  },
  [ButtonType.DELETE]: {
    enabled: false,
    hide: false,
  },
};

type GroupByButtons = {
  name: string;
  columnName: GroupBy;
};

export type ToolsBarProps = {
  buttons?: Partial<Record<ButtonType, ButtonProps>>;
  groupByButtons?: GroupByButtons[];
};

export default function ToolsBar(props: ToolsBarProps) {
  const { mode } = useColorScheme();
  const { updateOpen, updateType } = useQuickDrawer();

  const buttons = { ...ALL_BUTTONS, ...props.buttons };
  const groupByButtons = props.groupByButtons || [];

  const {
    enableAdd,
    enableGrouping,
    enableUngrouping,
    enableEdit,
    enableDelete,
  } = useSortToolsBarStates();

  const open = useDialogDrawerStore(({ open }) => open);
  const openGroupingDialog = () => open("group-entities");
  const openUngroupingDialog = () => open("ungroup-entities");
  const openDeleteDialog = () => open("delete-entities");
  const openFormDrawer = () => open("form-drawer");

  const { setGroupedField, groupedField } = useGridStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openPivot = Boolean(anchorEl);

  const handleClickPivot = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePivot = () => {
    setAnchorEl(null);
  };

  const handleGroupBy = (columnName: GroupBy) => {
    setGroupedField(columnName === groupedField ? undefined : columnName);
    handleClosePivot();
  };

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
        <Box display="flex" gap={1} alignItems="center">
          {buttons[ButtonType.ADD] && (
            <IconButton
              color="default"
              aria-label="add"
              onClick={buttons[ButtonType.ADD]?.onClick || openFormDrawer}
              disabled={!enableAdd}
            >
              <Add className="" />
            </IconButton>
          )}
          {buttons[ButtonType.EDIT] && (
            <IconButton
              color="default"
              aria-label="edit"
              disabled={!enableEdit}
              onClick={buttons[ButtonType.EDIT]?.onClick || openFormDrawer}
            >
              <Edit />
            </IconButton>
          )}

          {!buttons[ButtonType.PIN]?.hide && (
            <IconButton
              color="default"
              aria-label="pin"
              disabled={!buttons[ButtonType.PIN]?.enabled}
              onClick={buttons[ButtonType.PIN]?.onClick}
            >
              <PushPinOutlined className="" />
            </IconButton>
          )}

          {buttons[ButtonType.DELETE] && (
            <IconButton
              color="error"
              aria-label="delete"
              disabled={!enableDelete}
              onClick={openDeleteDialog}
            >
              <DeleteOutline className="" />
            </IconButton>
          )}

          <div
            className="w-[1px] h-[24px]"
            style={{
              backgroundColor: "var(--mui-palette-divider)",
            }}
          />

          {!buttons[ButtonType.GROUP]?.hide && (
            <IconButton
              color="default"
              aria-label="group"
              disabled={!enableGrouping}
              onClick={openGroupingDialog}
            >
              <SelectAll />
            </IconButton>
          )}

          {!buttons[ButtonType.UNGROUP]?.hide && (
            <IconButton
              color="default"
              size="small"
              aria-label="ungroup"
              disabled={!enableUngrouping}
              onClick={openUngroupingDialog}
            >
              <Deselect className="" />
            </IconButton>
          )}

          {!buttons[ButtonType.PIVOT]?.hide && (
            <>
              <IconButton
                color={!!groupedField ? "primary" : "default"}
                aria-label="pivot"
                disabled={
                  !buttons[ButtonType.PIVOT]?.enabled &&
                  groupByButtons.length === 0
                }
                onClick={buttons[ButtonType.PIVOT]?.onClick || handleClickPivot}
              >
                <PivotTableChartOutlined className="" />
              </IconButton>

              {groupByButtons.length > 0 && (
                <Menu
                  id="pivot-menu"
                  anchorEl={anchorEl}
                  open={openPivot}
                  onClose={handleClosePivot}
                  slotProps={{
                    list: {
                      "aria-labelledby": "pivot-button",
                    },
                  }}
                >
                  {groupByButtons.map(({ name, columnName }) => (
                    <MenuItem
                      key={columnName}
                      selected={columnName === groupedField}
                      onClick={() => handleGroupBy(columnName)}
                    >
                      <ListItemText>{name}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </>
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
