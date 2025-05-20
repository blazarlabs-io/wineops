"use client";

import { Stack } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { Grape } from "@/models/types/db";
import GrapesTable from "@/components/table/grapes";

export default function GrapesDashboard() {
  const [selectionData, setSelectionData] = useState<Grape[]>([]);
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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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

      <GrapesTable
        onChangeData={setSelectionData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
      />
    </Stack>
  );
}
