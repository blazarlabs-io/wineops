import VineyardCreateEditForm from "@/components/forms/vineyard/vineyard-create-edit-form";
import { Vineyard } from "@/models/types/db";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import EntityFormDrawer from "../entity-form-drawer";

export default function VineyardFormDrawer() {
  const [clicked, setClicked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);

  const handleClick = () => {
    setClicked(true);
  };

  const handleOnSave = (data: Vineyard) => {
    setClicked(false);
  };

  const handleNameError = (isError: boolean) => {
    setNameError(isError);
  };

  return (
    <EntityFormDrawer entityName="vineyard">
      <Box sx={{ flexGrow: 1, overflowY: "auto" }} className="">
        <VineyardCreateEditForm
          onSave={handleOnSave}
          clicked={clicked}
          setIsSubmitting={setIsSubmitting}
          onNameError={handleNameError}
        />
      </Box>

      <Box display={"flex"} px={2} pb={4} pt={1}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleClick}
          disabled={isSubmitting || nameError}
        >
          Save
        </Button>
      </Box>
    </EntityFormDrawer>
  );
}
