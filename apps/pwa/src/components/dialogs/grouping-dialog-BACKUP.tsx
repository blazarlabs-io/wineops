import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { ChangeEvent, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import { Vineyard } from "@/models/types/db";
import SelectAllIcon from "@mui/icons-material/SelectAll";

type GroupingDialogProps<T> = {
  open: boolean;
  rows: T[];
  groups: string[];
  onClose: () => void;
  onAddToGroup: (group: string[]) => void;
};

export default function GroupingDialog<T extends Vineyard>({
  open,
  rows,
  groups,
  onClose,
  onAddToGroup,
}: GroupingDialogProps<T>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);

  const isAddToGroupDisabled = selectedGroup === "" && newGroup === "";

  const handleGroupChange = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value);
  };

  const handleNewGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroup(event.target.value);
  };

  const handleClose = () => {
    setNewGroup("");
    setSelectedGroup("");
    setIsSwapped(false);
    onClose();
  };

  const handleAddToGroup = () => {
    const selectedGroups =
      selectedGroup !== "" ? selectedGroup.split(" > ") : [];

    const groupsToAdd =
      newGroup !== ""
        ? isSwapped
          ? [newGroup, ...selectedGroups]
          : [...selectedGroups, newGroup]
        : selectedGroups;

    onAddToGroup(groupsToAdd);
    handleClose();
  };

  const hasGroups = groups && groups.length > 0;
  const fullPath = isSwapped
    ? newGroup
      ? `${newGroup}${selectedGroup ? ` > ${selectedGroup}` : ""}`
      : selectedGroup
    : selectedGroup
      ? `${selectedGroup}${newGroup ? ` > ${newGroup}` : ""}`
      : newGroup;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      aria-labelledby="grouping-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "375px",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="grouping-dialog-title">
        <SelectAllIcon color="primary" sx={{ mr: 2 }} />
        Grouping
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          top: 8,
          right: 8,
          position: "absolute",
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          {hasGroups
            ? "Add to an existing group or create a new one:"
            : "Create a new group:"}
        </Typography>
        <Stack
          direction="row"
          component="form"
          spacing={2}
          sx={{
            my: 2,
            alignItems: "center",
          }}
        >
          <Stack
            direction={isSwapped ? "row-reverse" : "row"}
            spacing={2}
            sx={{
              alignItems: "center",
              width: "100%",
            }}
          >
            {hasGroups && (
              <>
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="group-select-label">
                    Existing group
                  </InputLabel>
                  <Select
                    labelId="group-select-label"
                    id="group-select"
                    label="Existing group"
                    value={selectedGroup}
                    onChange={handleGroupChange}
                  >
                    <MenuItem aria-label="None" value="">
                      <em>None</em>
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Swap group order" arrow>
                  <Fab
                    size="small"
                    id="swap-groups"
                    name="swap-groups"
                    aria-label="swap"
                    className="shadow-xs"
                    onClick={() => setIsSwapped((prev) => !prev)}
                  >
                    <SwapHorizIcon />
                  </Fab>
                </Tooltip>
              </>
            )}
            <FormControl sx={{ width: hasGroups ? 200 : "100%" }}>
              <TextField
                id="new-group"
                label="New group"
                variant="outlined"
                value={newGroup}
                onChange={handleNewGroupChange}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack sx={{ py: 2 }} gap={1}>
          <Typography gutterBottom>
            Items to be added
            {fullPath && (
              <>
                {" "}
                to <strong>{fullPath}</strong> group
              </>
            )}
            :
          </Typography>
          <Stack px={2} gap={1}>
            {rows.map(({ id, name }, index) => (
              <Typography key={id} variant="body2">
                {index + 1}. {name}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Tooltip title="Add to group" arrow>
          <Button
            autoFocus
            variant="contained"
            id="add-to-group"
            name="add-to-group"
            aria-label="group"
            className="shadow-xs"
            onClick={handleAddToGroup}
            disabled={isAddToGroupDisabled}
          >
            Group
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
