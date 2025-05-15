"use client";

import { DataTable } from "@/components/table/data-table";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { Vineyard } from "@/models/types/db";
import { Box, useColorScheme } from "@mui/material";
import { StrictMode, useState } from "react";
import DemoTable from "../table/demo-table";
import GroupableDataTable from "../table/groupable-data-table";
// import DemoTable from "../table/demo-table";

export default function WorkspacePage() {
  const { mode } = useColorScheme();

  const [selectionData, setSelectionData] = useState<Vineyard[]>([]);

  const { enableEdit, enableGrouping, enableDelete, enableUngrouping } =
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
    <Box className="flex w-full h-full">
      <Box className="flex flex-col gap-4 w-full">
        <ToolsBar
          enableCreate={true}
          enableEdit={enableEdit}
          enableGrouping={enableGrouping}
          enableDelete={enableDelete}
          enableUngrouping={enableUngrouping}
          onClickGroup={handleClickOpenGroupingDialog}
          onClickUngroup={handleClickOpenUngroupingDialog}
        />

        <StrictMode>
          {/* <DataTable
            isDarkMode={mode === "dark"}
            onChangeData={setSelectionData}
            openGroupingDialog={openGroupingDialog}
            openUngroupingDialog={openUngroupingDialog}
            handleCloseGroupingDialog={handleCloseGroupingDialog}
            handleCloseUngroupingDialog={handleCloseUngroupingDialog}
          /> */}
          <GroupableDataTable
            isDarkMode={mode === "dark"}
            //  onChangeData={setSelectionData}
            //  openGroupingDialog={openGroupingDialog}
            //  openUngroupingDialog={openUngroupingDialog}
            //  handleCloseGroupingDialog={handleCloseGroupingDialog}
            //  handleCloseUngroupingDialog={handleCloseUngroupingDialog}
          />
        </StrictMode>
      </Box>
    </Box>
  );
}
