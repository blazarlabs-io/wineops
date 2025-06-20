import VineyardCreateEditForm from "@/components/forms/vineyard/vineyard-create-edit-form";
import { FormMode, Vineyard } from "@/models/types/db";
import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EntityFormDrawer from "../entity-form-drawer";

export type VineyardFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  vineyard: Vineyard;
  type: FormMode;
};

export default function VineyardFormDrawer({
  open,
  onClose,
  vineyard,
  type,
}: VineyardFormDrawerProps) {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = () => {
    console.log("clicked");
    setClicked(true);
  };

  const handleOnSave = (data: Vineyard) => {
    console.log("handleOnSave", data);
    setClicked(false);
  };

  // useEffect(() => {
  //   console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  //   console.log("VINEYARD", vineyard);
  //   console.log("TYPE", type);
  //   console.log("OPEN", open);
  //   console.log("CLICKED", clicked);
  //   console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n");
  // });

  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Stack mt={4} gap={0}>
        <Box pr={1} pt={1} sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Box px={2} pb={2}>
          <Typography variant="h5" fontWeight={"medium"}>
            {type === "create"
              ? "Create a New Vineyard"
              : "Edit Existing Vineyard"}
          </Typography>
        </Box>
      </Stack>

      {vineyard && (
        <Box sx={{ flexGrow: 1, overflowY: "auto" }} className="">
          <VineyardCreateEditForm
            vineyard={vineyard}
            closeDrawer={onClose}
            type={type}
            onSave={handleOnSave}
            clicked={clicked}
          />
        </Box>
      )}
      <Box display={"flex"} px={2} pb={4} pt={1}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleClick}
        >
          Save
        </Button>
      </Box>
    </EntityFormDrawer>
  );
}
