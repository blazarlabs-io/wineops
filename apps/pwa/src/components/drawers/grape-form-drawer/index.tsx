import GrapeForm from "@/components/forms/grape/grape-form";
import { FormMode, Grape } from "@/models/types/db";
import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton, Typography } from "@mui/material";

export type GrapeFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  grape: Grape;
  type: FormMode;
};

export default function GrapeFormDrawer({
  open,
  onClose,
  grape,
  type,
}: GrapeFormDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: ({ zIndex }) => zIndex.drawer - 1 }}
    >
      <Box
        sx={{
          minWidth: "320px",
          maxWidth: "530px",
          background: "var(--mui-palette-background-default)",
          minHeight: "100vh",
          height: "100%",
        }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box padding={2} marginTop={4}>
          <Typography variant="h5" fontWeight={"medium"}>
            Buy Grapes
          </Typography>
          <Typography variant="body2" className="opacity-75">
            {type === "create" ? "New batch" : "Existing batch"}
          </Typography>
        </Box>

        <GrapeForm grape={grape} closeDrawer={onClose} type={type} />
      </Box>
    </Drawer>
  );
}
