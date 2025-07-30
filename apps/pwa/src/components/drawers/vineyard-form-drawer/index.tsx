import VineyardCreateEditForm, {
  VineyardFormRef,
} from "@/components/forms/vineyard/vineyard-create-edit-form";
import { Box, Button } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import EntityFormDrawer from "../entity-form-drawer";

export default function VineyardFormDrawer() {
  const formRef = useRef<VineyardFormRef>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    if (formRef.current) {
      console.log("Attempting to save vineyard form...");
      const isValid = await formRef.current.validate();

      if (isValid) {
        console.log("Validation passed, proceeding with save");
        await formRef.current.save();
      } else {
        console.warn("Validation failed, submission blocked");
      }
    }
  }, []);

  const handleNameError = useCallback((isError: boolean) => {
    setNameError(isError);
  }, []);

  return (
    <EntityFormDrawer entityName="vineyard">
      <Box sx={{ flexGrow: 1, overflowY: "auto" }} className="">
        <VineyardCreateEditForm
          ref={formRef}
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
