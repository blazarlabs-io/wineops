import { ROW_HEIGHT_DEFAULT, ROW_HEIGHT_EXPANDED } from "@/data/constants";
import { ExpandMore } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { useCallback, useEffect, useRef, useState } from "react";

export default function GroupCellRenderer(params: ICellRendererParams) {
  const detailRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState<boolean>(false);

  // * master detail custom renderer
  const handleMasterDetailExpansion = useCallback(() => {
    setExpanded(!params.node.expanded);
    params.node.setExpanded(!params.node.expanded);
    params.node.setRowHeight(
      params.node.expanded ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT_DEFAULT / 2
    );
  }, []);

  useEffect(() => {
    setExpanded(params.node.expanded);
  }, [params.node.expanded]);

  return (
    <>
      {params.node.group ? (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">(GROUP)</span>
          <span>{params.value}</span>
        </div>
      ) : (
        <div ref={detailRef} className="">
          <div className="flex items-center gap-2">
            <IconButton
              type="button"
              size="small"
              onClick={handleMasterDetailExpansion}
            >
              <ExpandMore className="max-w-5 max-h-5 -rotate-90 opacity-60" />
            </IconButton>
            <span>{params.value}</span>
          </div>
          {expanded && (
            <div className="fixed bottom-0 flex items-center justify-center left-0 w-full h-[280px] bg-[#ff5af744] z-[9999]">
              <Typography variant="h4">{params.node.data.id}</Typography>
            </div>
          )}
        </div>
      )}
    </>
  );
}
