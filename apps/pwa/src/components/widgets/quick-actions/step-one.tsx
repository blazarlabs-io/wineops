
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { GridView, Search } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Icon, IconifyIcon } from "@iconify/react";
import { ActionsEntity } from "@/models/types/actions";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Grape, GrapeStatus } from "@/models/types/db";
import { useGrape } from "@/context/grape";

interface QuickActionsWidgetStepOneProps<T extends ActionsEntity> {
  actions?: T;
  onClick: (action: string) => void;
}

export default function QuickActionsWidgetStepOne<T extends ActionsEntity>({
  actions,
  onClick,
}: QuickActionsWidgetStepOneProps<T>) {
  const [actionsList, setActionsList] = useState<any>([]);
  const [selectedAction, setSelectedAction] = useState<string>("");

  const { grapes } = useGrape();
  const { selected, entityName } = useSelectedEntitiesStore((state) => state);

  const updatedSelected = useMemo(
    () =>
      entityName === "grape"
        ? selected.map(
            (selected) => grapes.find((g) => g.id === selected.id) ?? selected
          )
        : [],
    [entityName, grapes, selected]
  );

  const enableIntake =
    updatedSelected.length === 0 ||
    (updatedSelected as Grape[]).some(
      ({ status }) => status === GrapeStatus.IN_TRANSIT
    );

  const handleActionClick = (action: string) => {
    onClick(action);
    setSelectedAction((prevAction) => (prevAction === action ? "" : action));
  };

  useEffect(() => {
    if (actions) {
      const keys = Object.keys(actions);
      keys.map((key, index) => {
        keys[index] = key.split("-").join(" ");
      });
      setActionsList(keys);

      if (keys.length === 1) {
        setSelectedAction(keys[0]);
      }
    }
  }, [actions]);

  return (
    <Box
      px={2}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      className="pointer-events-auto"
      sx={{
        backgroundColor: "transparent",
      }}
    >
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <GridView />
        <Typography variant="h5">Actions</Typography>
      </Box>
      <Box sx={{ overflowX: "hidden" }}>
        {}
        <TextField
          fullWidth
          size="small"
          placeholder="Search actions"
          InputProps={{
            startAdornment: (
              <Box paddingRight={1}>
                <Search />
              </Box>
            ),
          }}
        />
        {}
        <List
          sx={{
            width: "100%",
            gap: 1,
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {actionsList &&
            actionsList.length > 0 &&
            actionsList.map((action: any) => (
              <div key={action} className="w-full my-2">
                <ListItemButton
                  onClick={() => handleActionClick(action)}
                  sx={{
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    width: "100%",
                  }}
                  disabled={action === "grape intake" && !enableIntake}
                >
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems={"center"}
                    width={"100%"}
                  >
                    {actions && (
                      <ListItemIcon
                        sx={{ minWidth: "unset" }}
                        className="border rounded-full p-1"
                        style={{
                          minWidth: "unset",
                          backgroundColor: "var(--mui-palette-text-primary)",
                        }}
                      >
                        <Icon
                          icon={
                            actions &&
                            (
                              actions[
                                action
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase() as keyof T
                              ] as { icon: string | IconifyIcon }
                            ).icon
                          }
                          width={18}
                          height={18}
                          style={{
                            color: "var(--mui-palette-background-default)",
                          }}
                        />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      className="font-normal capitalize"
                      primary={action}
                    />
                  </Stack>
                </ListItemButton>
              </div>
            ))}
        </List>
      </Box>
    </Box>
  );
}
