/* eslint-disable @typescript-eslint/no-explicit-any */
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { Icon } from "@iconify/react";
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
import React from "react";
import { useEffect, useState } from "react";

export interface QuickActionsWidgetProps {
  actions?: any;
  onClick: (action: string) => void;
}

export default function QuickActionsWidget({
  actions,
  onClick,
}: QuickActionsWidgetProps) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [actionsList, setActionsList] = useState<any>([]);

  const handleActionClick = (action: string) => {
    onClick(action);
    setSelectedAction(action);
  };

  useEffect(() => {
    if (actions) {
      console.log("actions", actions);
      const keys = Object.keys(actions);
      keys.map((key, index) => {
        keys[index] = key.split("-").join(" ");
      });
      setActionsList(keys);
    }
  }, [actions]);

  return (
    <Box
      px={2}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      className="pointer-events-auto"
    >
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <GridView />
        <Typography variant="h5">Actions</Typography>
      </Box>
      <Box sx={{ width: RIGHT_DRAWER_WIDTH, overflowX: "hidden" }}>
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
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
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
                            actions[action.split(" ").join("-").toLowerCase()]
                              .icon as string
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
                {action === selectedAction && (
                  <Box
                    padding={2}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                  >
                    {/* <Form /> */}
                    <React.Fragment>
                      {actions[action.split(" ").join("-")].form}
                    </React.Fragment>
                  </Box>
                )}
              </div>
            ))}
        </List>
      </Box>
    </Box>
  );
}
