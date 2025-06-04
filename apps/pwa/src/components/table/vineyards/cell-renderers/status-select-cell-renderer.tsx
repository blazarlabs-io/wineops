import React from "react";

import type { CustomCellRendererProps } from "ag-grid-react";
import { getStatusStyles } from "@/utils/get-status-style";
import { useColorScheme } from "@mui/material";

export const StatusSelectCellRenderer = (props: CustomCellRendererProps) => {
  const { mode } = useColorScheme();
  return (
    <>
      {props.value != null && (
        <div
          style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          className="flex items-center justify-start min-h-[32px] h-full px-2"
        >
          <span
            style={getStatusStyles(props.value, mode)}
            className="border text-xs py-1 px-2 rounded-full my-1"
          >
            {props.value.toUpperCase()}
          </span>
        </div>
      )}
    </>
  );
};
