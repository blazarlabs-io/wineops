import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton } from "@mui/material";

export type EntityFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function EntityFormDrawer({
  open,
  onClose,
  children,
}: EntityFormDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: ({ zIndex }) => zIndex.drawer - 1 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "320px",
          width: "420px",
          background: "var(--mui-palette-background-default)",
          minHeight: "100vh",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {children}
      </Box>
    </Drawer>
  );
}
