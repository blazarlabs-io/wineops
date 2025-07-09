import Badge from "@mui/material/Badge";
import { ReactNode } from "react";

type GroupBadgeProps = {
  content?: ReactNode;
};

export default function GroupBadge({ content }: GroupBadgeProps) {
  return (
    <Badge
      overlap="circular"
      badgeContent={content}
      sx={{
        top: "-1px",
        left: "16px",
        "& .MuiBadge-badge": {
          border: `1px solid ${"var(--mui-palette-text-secondary)"}`,
          color: "var(--mui-palette-text-secondary)",
          padding: "0 4px",
        },
      }}
    />
  );
}
