import QuickActionsWidget from "@/components/widgets/quick-actions";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { ActionsEntity } from "@/models/types/actions";
import { Close } from "@mui/icons-material";
import { Drawer, IconButton, styled } from "@mui/material";

type QuickActionsDrawerProps<T extends ActionsEntity> = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: T;
  dashboard?: string;
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

export default function QuickActionsDrawer<T extends ActionsEntity>({
  open,
  onOpenChange,
  actions,
  dashboard,
}: QuickActionsDrawerProps<T>) {
  const handleDrawerClose = () => {
    if (onOpenChange) onOpenChange(false);
  };

  const handleActionClick = (action: string) => {};

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        "& .MuiDrawer-paper": {
          minWidth: RIGHT_DRAWER_WIDTH,
          overflowX: "hidden",
          boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.075)",
        },
      }}
      className=""
    >
      <DrawerHeader
        style={{ backgroundColor: "var(--mui-palette-background-default)" }}
        className="pointer-events-auto m-[0px] max-h-sfit p-[0px] pt-6 mt-[38px]"
      >
        <IconButton onClick={handleDrawerClose} className="">
          <Close className="w-4 h-4" />
        </IconButton>
      </DrawerHeader>
      {}
      <QuickActionsWidget
        onClick={handleActionClick}
        actions={actions}
        dashboard={dashboard}
      />
    </Drawer>
  );
}
