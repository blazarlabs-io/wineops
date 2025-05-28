"use client";

// import PrimaryVinificationTable from "@/components/table/primary-vinification";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { Must } from "@/models/types/db";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function PrimaryVinificationDashboard() {
  const [selectionData, setSelectionData] = useState<Must[]>([]);
  const { enableGrouping, enableUngrouping } =
    useSortToolsBarStates(selectionData);

  const [openGroupingDialog, setOpenGroupingDialog] = useState(false);
  const [openUngroupingDialog, setOpenUngroupingDialog] = useState(false);

  const handleClickOpenGroupingDialog = () => {
    setOpenGroupingDialog(true);
  };

  const handleCloseGroupingDialog = () => {
    setOpenGroupingDialog(false);
  };

  const handleClickOpenUngroupingDialog = () => {
    setOpenUngroupingDialog(true);
  };

  const handleCloseUngroupingDialog = () => {
    setOpenUngroupingDialog(false);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "left",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4">Primary Vinification</Typography>
      <ToolsBar
        buttons={{
          [ButtonType.GROUP]: {
            enabled: enableGrouping,
            onClick: handleClickOpenGroupingDialog,
          },
          [ButtonType.UNGROUP]: {
            enabled: enableUngrouping,
            onClick: handleClickOpenUngroupingDialog,
          },
        }}
      />

      {/* <PrimaryVinificationTable
        onChangeData={setSelectionData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
      /> */}
    </Stack>
  );
}
