/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BaseTable from "@/components/table/base-table";
import { PushPin } from "@mui/icons-material";
import { useColorScheme, Box, IconButton } from "@mui/material";
import { RowSelectionOptions } from "ag-grid-enterprise";
import { useCallback, useState } from "react";

export default function Sandbox() {
  const { mode } = useColorScheme();
  const [selectedRows, setSelectedRows] = useState<any>();
  const [pinnedRows, setPinnedRows] = useState<any>(null);
  const [enablePin, setEnablePin] = useState<boolean>(false);

  const handleOnRowSelection = useCallback((rows: any) => {
    setSelectedRows(rows);
    if (rows && rows.length > 0) {
      setEnablePin(true);
    } else {
      setEnablePin(false);
    }
  }, []);

  const handlePinRows = useCallback(() => {
    if (selectedRows && selectedRows.length > 0) {
      setPinnedRows(selectedRows);
    } else {
      setPinnedRows(null);
    }
  }, [selectedRows]);

  return (
    <>
      <Box display="flex" flexDirection={"column"} gap={2} alignItems={"start"}>
        <IconButton size="small" disabled={!enablePin} onClick={handlePinRows}>
          <PushPin />
        </IconButton>
        <BaseTable
          isDarkMode={mode === "dark"}
          onRowSelection={handleOnRowSelection}
          pinnedRows={pinnedRows}
        />
      </Box>
    </>
  );
}
