import type { CustomCellRendererProps } from "ag-grid-react";

export const EntryCellRenderer = ({ value, data }: CustomCellRendererProps) => {
  return (
    <div style={{ lineHeight: 1, border: "0px solid red", height: 80, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
      <div>{value?.status}</div>
      <div>{value?.location1}</div>
      <div>{value?.date1}</div>
    </div>
  );
};
