import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import VineyardDetailsWidget from "@/components/widgets/vineyard/vineyard-details-widget";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const rowName =
    params.value && params.value.length > 1
      ? params.value[params.value.length - 1]
      : params.node.data.name;

  console.log("XXXXXXXXXXXXXXXXXXXXXXXX", params.value);

  return (
    <>
      {!params.node.group && params.node.data ? (
        <div
          style={{
            height: 364,
            backgroundColor: "var(--mui-palette-background-default)",
          }}
          className="absolute left-0 top-0 w-full flex items-center justify-center"
        >
          <VineyardDetailsWidget vineyard={params.node.data} />
        </div>
      ) : (
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
              params.node.group && params.node.data === undefined
                ? ""
                : params.node.level > 0
                  ? "4px solid var(--mui-palette-divider)"
                  : "",
          }}
          className=""
        >
          {typeof params.value === "string" ? (
            <div className="flex flex-col gap-2 pl-2">
              <Typography variant="body1" className="max-h-fit leading-4">
                {params.value}
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
                  params.node.group && params.node.data === undefined
                    ? ""
                    : params.node.level > 0
                      ? "8px"
                      : "",
              }}
            >
              <Typography className="leading-[1]">{rowName}</Typography>
              {params.node.data && (
                <p className="text-xs text-muted-foreground leading-[1]">
                  {params.node.data.cadastralNumber || "Cadastral Number N/A"}
                </p>
              )}
            </div>
          )}
          {params.node.data &&
          params.node.data.info &&
          params.node.data.info.certifications ? (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft:
                  params.node.group && params.node.data === undefined
                    ? ""
                    : params.node.level > 0
                      ? "8px"
                      : "",
              }}
            >
              <CertificationsDataDisplay
                certifications={params.node.data.info.certifications}
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
      )}
    </>
  );
};
