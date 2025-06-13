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
        position: "absolute",
        top: "calc(50% + 2px)",
        right: 32,
        "& .MuiBadge-badge": {
          border: `1px solid ${"var(--mui-palette-text-secondary)"}`,
          color: "var(--mui-palette-text-secondary)",
          padding: "0 4px",
        },
      }}
    />
  );
}
