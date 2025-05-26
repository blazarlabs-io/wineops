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
  }, [params.node]);

  useEffect(() => {
    setExpanded(params.node.expanded);
  }, [params.node.expanded]);

  const nonGroupChildren =
    params.node?.allLeafChildren?.filter(
      (node) => node?.data?.rowType !== "group"
    )?.length ?? 0;

  const isGroupChild =
    !(params.node.group || params.data.rowType === "group") &&
    !params.value &&
    !!params.node.data;
  const group = params?.node?.data?.group;
  const childValue = isGroupChild
    ? group
      ? Array.isArray(group)
        ? group[group.length - 1]
        : group
      : ""
    : "";

  console.log(`params:${params.value}`, params);

  return (
    <div className="select-text">
      {params.node.group || params.data.rowType === "group" ? (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">(GROUP)</span>
          <span>
            {(params?.node?.field === "entry"
              ? params.value?.location1
              : params.value) ?? <i>unknown {params.node?.field}</i>}
          </span>
          {/*<span>({nonGroupChildren})</span>*/}
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
            <span>
              {params.value
                ? JSON.stringify(params.value)
                : childValue
                  ? JSON.stringify(childValue)
                  : ""}
            </span>
          </div>
          {expanded && (
            <div className="fixed bottom-0 flex items-center justify-center left-0 w-full h-[280px] bg-[#ff5af744] z-[9999]">
              <Typography variant="h4">{params.node.data.id}</Typography>
              <div className="flex flex-col leading-none p-2 gap-2">
                {Object.entries(params.node.data ?? {}).map(([key, value]) => (
                  <div key={`${key}-${value}`}>
                    {key}: {JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
