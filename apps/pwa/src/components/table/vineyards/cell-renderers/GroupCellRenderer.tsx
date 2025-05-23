import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Badge, Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      gap={1}
      justifyItems={"flex-start"}
      height={ROW_HEIGHT_DEFAULT}
      sx={{
        borderLeft: node.level > 0 ? "8px" : "",
        borderStyle: "solid",
        borderColor: "var(--mui-palette-divider)",
      }}
      className="w-full flex flex-col items-start gap-2 pl-4 "
    >
      <Badge
        overlap="circular"
        badgeContent={node.allChildrenCount}
        sx={{
          position: "absolute",
          top: "50%",
          right: 32,
          transform: "translateY(-50%)",
          "& .MuiBadge-badge": {
            border: `2px solid ${"var(--mui-palette-text-secondary)"}`,
            color: "var(--mui-palette-text-secondary)",
            padding: "0 4px",
            borderWidth: "1px",
          },
        }}
      />

      <Typography variant="body1" className="max-h-fit">
        {value}
      </Typography>

      {node.data && node.data.info && node.data.info.certifications ? (
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyItems: "flex-start",
          }}
        >
          <CertificationsDataDisplay
            certifications={node.data.info.certifications}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <CertificationsDataDisplay
            certifications={{
              eco: { active: false, fileUrl: "" },
              igp: { active: false, fileUrl: "" },
              dop: { active: false, fileUrl: "" },
            }}
          />
        </div>
      )}
      {!node.group && (
        <p className="max-h-fit min-h-fit leading-4">
          {node.data.cadastralNumber}
        </p>
      )}
    </Box>
  );
};
