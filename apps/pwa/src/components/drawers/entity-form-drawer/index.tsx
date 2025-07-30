import { EntitiesNames, EntityName, FormMode } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type EntityFormDrawerProps = {
  entityName: EntityName;
  children?: React.ReactNode;
};

export default function EntityFormDrawer({
  entityName,
  children,
}: EntityFormDrawerProps) {
  const { dialogs, close } = useDialogDrawerStore((state) => state);
  const isOpen = dialogs["form-drawer"];
  const onClose = () => close("form-drawer");

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      close("form-drawer");
    }
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
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

        <Box padding={2} marginTop={4}>
          <Typography variant="h5" fontWeight={"medium"}>
            {entityName === "grape" ? (
              formType === "create" ? (
                "Register a grape batch"
              ) : (
                "Edit the grape batch"
              )
            ) : entityName === "must" ? (
              "Buy Must"
            ) : (
              <>
                {formType === "create" ? "New" : "Edit"}{" "}
                {EntitiesNames[entityName][0]}
              </>
            )}
          </Typography>
        </Box>

        {children}
      </Box>
    </Drawer>
  );
}
