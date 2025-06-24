import VineyardCreateEditForm from "@/components/forms/vineyard/vineyard-create-edit-form";
import { Vineyard } from "@/models/types/db";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import EntityFormDrawer from "../entity-form-drawer";

export default function VineyardFormDrawer() {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = () => {
    console.log("clicked");
    setClicked(true);
  };

  const handleOnSave = (data: Vineyard) => {
    console.log("handleOnSave", data);
    setClicked(false);
  };

  return (
    <EntityFormDrawer entityName="vineyard">
      <Box sx={{ flexGrow: 1, overflowY: "auto" }} className="">
        <VineyardCreateEditForm onSave={handleOnSave} clicked={clicked} />
      </Box>

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
