import QuickActionsWidget from "@/components/widgets/quick-actions";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { Close } from "@mui/icons-material";
import { Drawer, IconButton, styled } from "@mui/material";
import { useState } from "react";

export type QuickActionsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(8),
  padding: theme.spacing(0, 0),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  overflowX: "hidden",
}));

export default function QuickActionsDrawer({
  open,
  onOpenChange,
}: QuickActionsDrawerProps) {
  const [, setSelectedAction] = useState<string>("");

  const handleDrawerClose = () => {
    onOpenChange(false);
  };

  const handleActionClick = (action: string) => {
    console.log("ACTION CLICKED", action);
    setSelectedAction(action);
  };

  return (
    <Drawer
      sx={{
        width: RIGHT_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // width: RIGHT_DRAWER_WIDTH,
          overflowX: "hidden",
        },
        zIndex: (theme) => {
          let z = 0;
          if (open) {
            z = theme.zIndex.drawer;
          } else {
            z = theme.zIndex.drawer - 100;
          }
          return z;
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
      className="pointer-events-none"
    >
      <DrawerHeader className="pointer-events-auto m-[0px] max-h-sfit p-[0px] pt-6 mt-[38px]">
        <IconButton onClick={handleDrawerClose} className="">
          <Close className="w-4 h-4" />
        </IconButton>
      </DrawerHeader>
      {/* * QUICK ACTIONS */}
      <QuickActionsWidget onClick={handleActionClick} />
    </Drawer>
  );
}
