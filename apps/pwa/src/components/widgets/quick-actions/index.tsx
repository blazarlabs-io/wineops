import HarvestActionForm from "@/components/forms/actions/harvest-action-form";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { quickActions } from "@/data/system-variables";
import { Icon } from "@iconify/react";
import { GridView, Search } from "@mui/icons-material";
import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useVineyard } from "@/context/vineyard";

export interface QuickActionsWidgetProps {
  onClick: (action: string) => void;
}

export default function QuickActionsWidget({
  onClick,
}: QuickActionsWidgetProps) {
  const { selectedVineyards } = useVineyard();

  const [selectedAction, setSelectedAction] = useState<string>("");

  const handleActionClick = (action: string) => {
    onClick(action);
    setSelectedAction(action.split(" ").join("-").toLowerCase());
  };

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

            maxWidth: 360,
            bgcolor: "background.paper",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          // subheader={
          //   <ListSubheader component="div" id="nested-list-subheader">
          //     Nested List Items
          //   </ListSubheader>
          // }
        >
          {quickActions.map((action) => (
            <div key={action.name}>
              <ListItemButton onClick={() => handleActionClick(action.name)}>
                <ListItemIcon>
                  <Card variant="outlined" className="p-2">
                    <Icon
                      icon={action.icon}
                      width={24}
                      height={24}
                      className="text-neutral-400"
                    />
                  </Card>
                </ListItemIcon>
                <ListItemText className="font-normal" primary={action.name} />
              </ListItemButton>
              {selectedAction ===
                action.name.split(" ").join("-").toLowerCase() && (
                <Box
                  padding={2}
                  display={"flex"}
                  flexDirection={"column"}
                  gap={2}
                >
                  <HarvestActionForm vineyards={selectedVineyards} />
                </Box>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );
}
