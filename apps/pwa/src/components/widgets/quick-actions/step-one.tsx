/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";
import { Icon, IconifyIcon } from "@iconify/react";
import { ActionsEntity } from "@/models/types/actions";

export interface QuickActionsWidgetStepOneProps<T extends ActionsEntity> {
  actions?: T;
  onClick: (action: string) => void;
}

export default function QuickActionsWidgetStepOne<T extends ActionsEntity>({
  actions,
  onClick,
}: QuickActionsWidgetStepOneProps<T>) {
  const [actionsList, setActionsList] = useState<any>([]);
  const [selectedAction, setSelectedAction] = useState<string>("");

  const handleActionClick = (action: string) => {
    onClick(action);
    setSelectedAction((prevAction) => (prevAction === action ? "" : action));
  };

  useEffect(() => {
    if (actions) {
      console.log("actions", actions);
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
        {/* * SEARCH */}
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
        {/* * ACTIONS */}
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
