"use client";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import Anexa14Table from "@/components/table/anexa14";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Anexa14Dashboard() {
  const { selected, entityName } = useSelectedEntitiesStore((state) => state);

  const router = useRouter();

  const handleEditClick = () => {
    const id = selected[0]?.id;

    if (!id || entityName !== "anexa14") return;

    router.push(`anexa14/${id}`);
  };

  const handleAddClick = () => {
    router.push(`anexa14/new`);
  };

  const handleBackClick = () => {
    router.push(`/workspace/reports`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "left",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{ pt: 0.5, gap: 1, flexDirection: "row", alignItems: "center" }}
        >
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Anexa nr. 14</Typography>
        </Stack>

        <ToolsBar
          buttons={{
            [ButtonType.ADD]: { onClick: handleAddClick },
            [ButtonType.EDIT]: { onClick: handleEditClick },
            [ButtonType.GROUP]: { hide: true },
            [ButtonType.UNGROUP]: { hide: true },
            [ButtonType.PIVOT]: { hide: true },
            [ButtonType.PIN]: { hide: true },
          }}
        />

        <Anexa14Table />
      </Stack>

      <DeleteEntitiesDialog />
    </Box>
  );
}
