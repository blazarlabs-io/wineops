import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const rowName =
    value && value.length > 1 ? value[value.length - 1] : node.data.name;

  console.log("XXXXXXX", value, node, rowName);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100%",
        minHeight: "80px",
        width: "100%",
        margin: "auto",
        gap: "8px",
        borderLeft:
          node.group && node.data === undefined
            ? ""
            : node.level > 0
              ? "4px solid var(--mui-palette-divider)"
              : "",
      }}
      className=""
    >
      {typeof value === "string" ? (
        <div className="flex flex-col gap-2 pl-2">
          <Typography variant="body1" className="max-h-fit leading-4">
            {value}
          </Typography>
        </div>
      ) : (
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "4px",
            paddingLeft:
              node.group && node.data === undefined
                ? ""
                : node.level > 0
                  ? "8px"
                  : "",
          }}
        >
          <Typography className="leading-[1]">{rowName}</Typography>
          {node.data && (
            <p className="text-xs text-muted-foreground leading-[1]">
              {node.data.cadastralNumber || "Cadastral Number N/A"}
            </p>
          )}
        </div>
      )}
      {node.data && node.data.info && node.data.info.certifications ? (
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft:
              node.group && node.data === undefined
                ? ""
                : node.level > 0
                  ? "8px"
                  : "",
          }}
        >
          <CertificationsDataDisplay
            certifications={node.data.info.certifications}
          />
        </div>
      ) : (
        <div className="flex flex-col pl-2">
          <CertificationsDataDisplay
            certifications={{
              eco: { active: false, fileUrl: "" },
              igp: { active: false, fileUrl: "" },
              dop: { active: false, fileUrl: "" },
            }}
          />
        </div>
      )}
    </div>
  );
};
