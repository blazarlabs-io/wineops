import { DashboardEntity } from "@/models/types/dashboard";
import { SelectAll } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, useEffect, useState } from "react";
import EntityChip from "./entity-chip";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useGrouping } from "@/hooks/use-grouping";

type GroupingDialogProps<T> = {
  data?: T[];
  onAddToGroup: (selected: T[], group: string[]) => void;
};

export default function GroupingDialog<T extends DashboardEntity>({
  data = [],
  onAddToGroup,
}: GroupingDialogProps<T>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const { dialogs, close } = useDialogDrawerStore((state) => state);
  const isOpen = dialogs["group-entities"];
  const onClose = () => close("group-entities");

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGroupDisplayName, setSelectedGroupDisplayName] =
    useState<string>("");
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [newGroup, setNewGroup] = useState<string>("");
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [enableNewGroup, setEnableNewGroup] = useState<boolean>(false);

  const isAddToGroupDisabled = selectedGroup === "" && newGroup === "";

  // console.log("\n\n\n\n", data, "\n\n\n\n");

  const handleGroupChange = (event: SelectChangeEvent) => {
    console.log("GROUP CHANGE:", event.target.value);
    setSelectedGroup(event.target.value);
    setSelectedGroupDisplayName(event.target.value);
    if (selectedGroup === "new-group") {
      setEnableNewGroup(false);
    }
  };

  const handleParentChange = (event: SelectChangeEvent) => {
    console.log("PARENT CHANGE:", event.target.value);
    setSelectedParent(event.target.value);
    setSelectedGroup(event.target.value);
  };

  const handleNewGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroup(event.target.value);
    console.log("NEW GROUP:", event.target.value);
  };

  const handleEnableNewGroup = () => {
    setEnableNewGroup(true);
  };

  const handleClose = () => {
    setEnableNewGroup(false);
    setNewGroup("");
    setSelectedGroup("");
    setSelectedParent("");
    setSelectedGroupDisplayName("");
    setIsSwapped(false);
    onClose();
  };

  const handleAddToGroup = () => {
    const selectedGroups =
      selectedGroup !== "" &&
      selectedGroup !== "none" &&
      selectedGroup !== "root" &&
      selectedGroup !== "new-group" &&
      selectedGroup !== "parent-select"
        ? selectedGroup.split(" > ")
        : [];

    const groupsToAdd =
      newGroup !== ""
        ? isSwapped
          ? [newGroup, ...selectedGroups]
          : [...selectedGroups, newGroup]
        : selectedGroups;

    onAddToGroup(selected as T[], groupsToAdd);
    handleClose();
  };

  const hasGroups = true; //groups && groups.length > 0;
  const fullPath = isSwapped
    ? newGroup
      ? `${newGroup}${selectedGroup ? ` > ${selectedGroup}` : ""}`
      : selectedGroup
    : selectedGroup
      ? `${selectedGroup}${newGroup ? ` > ${newGroup}` : ""}`
      : newGroup;

  console.log("FULL PATH:", fullPath);

  const { uniqueGroups } = useGrouping<T>(data);

  useEffect(() => {
    console.log("\n\n\n\nSELECTED:", selected, "\n\n\n\n");
  }, [selected]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen={fullScreen}
      aria-labelledby="grouping-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "375px",
          maxWidth: "375px",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="grouping-dialog-title">
        <SelectAll color="action" sx={{ mr: 2 }} />
        Add to group
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
            ? "Add to an existing group or create a new one."
            : "Create a new group."}
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
            direction={"column"}
            spacing={2}
            sx={{
              alignItems: "center",
              width: "100%",
            }}
          >
            {hasGroups && (
              <>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="group-select-label">
                    Select or create
                  </InputLabel>
                  <Select
                    labelId="group-select-label"
                    id="group-select"
                    label="Select or create"
                    value={selectedGroupDisplayName}
                    onChange={handleGroupChange}
                    sx={{ width: "100%" }}
                  >
                    <MenuItem aria-label="None" value="none">
                      <em>None</em>
                    </MenuItem>
                    {uniqueGroups.map((group) => (
                      <MenuItem key={group as string} value={group as string}>
                        <Typography variant="body2">
                          {group as string}
                        </Typography>
                      </MenuItem>
                    ))}
                    <div
                      style={{
                        borderBottom: "1px solid var(--mui-palette-divider)",
                        paddingTop: "8px",
                        paddingBottom: "0px",
                      }}
                    />
                    <MenuItem
                      value="new-group"
                      className="flex items-center gap-2 mt-2"
                      style={{
                        backgroundColor:
                          "var(--mui-palette-paper-background-default)",
                      }}
                      onClick={handleEnableNewGroup}
                    >
                      {/* <AddCircleOutline className="text-lg" /> */}
                      <Typography variant="body2" color="primary">
                        CREATE NEW GROUP
                      </Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
                {enableNewGroup && (
                  <>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        id="new-group-name"
                        label="New group name"
                        variant="outlined"
                        value={newGroup}
                        onChange={handleNewGroupChange}
                      />
                    </FormControl>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="parent-select-label">
                        Choose parent
                      </InputLabel>
                      <Select
                        labelId="parent-select-label"
                        id="parent-select"
                        label="Choose parent"
                        value={selectedParent}
                        onChange={handleParentChange}
                        sx={{ width: "100%" }}
                      >
                        <MenuItem aria-label="Root" value="root">
                          <Typography variant="body2">Root</Typography>
                        </MenuItem>
                        {uniqueGroups.map((group) => (
                          <MenuItem
                            key={group as string}
                            value={group as string}
                          >
                            <Typography variant="body2">
                              {group as string}
                            </Typography>
                          </MenuItem>
                        ))}
                        <div
                          style={{
                            borderBottom:
                              "1px solid var(--mui-palette-divider)",
                            paddingTop: "8px",
                            paddingBottom: "0px",
                          }}
                        />
                        {/* <MenuItem
                          value="new-group"
                          className="flex items-center gap-2 mt-2"
                          style={{
                            backgroundColor:
                              "var(--mui-palette-paper-background-default)",
                          }}
                          onClick={handleEnableNewGroup}
                        >
                          <Typography variant="body2" color="primary">
                            CREATE NEW GROUP
                          </Typography>
                        </MenuItem> */}
                      </Select>
                    </FormControl>
                  </>
                )}
              </>
            )}
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
          </Typography>
          {selected && (
            <Stack px={0} gap={1} marginTop={2} direction="row" flexWrap="wrap">
              {selected.map((row) => (
                <EntityChip
                  row={row}
                  key={`${row.id}-${row["vesselId" as keyof DashboardEntity] || ""}`}
                />
              ))}
            </Stack>
          )}
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
