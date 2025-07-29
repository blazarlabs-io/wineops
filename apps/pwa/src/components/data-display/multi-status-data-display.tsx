import { SortedVineyardStatus } from "@/hooks/use-sort-vineyard-statuses";
import { Badge, Box, Button, Tooltip, Typography } from "@mui/material";
import { Fragment } from "react";

type StatusDataDisplayProps = {
  status: SortedVineyardStatus[];
  onOpen?: () => void;
};

export default function MultiStatusDataDisplay({
  status,
  onOpen,
}: StatusDataDisplayProps) {
  if (!status || status.length === 0) return;

  return (
    <div>
      {status.map(({ name, count }, index) => (
        <Fragment key={name}>
          {index < 2 ? (
            <span className="max-h-fit flex items-center justify-between text-xs font-semibold rounded-full px-2 py-1 gap-5">
              {name.toUpperCase()}
              <Badge
                overlap="circular"
                badgeContent={count}
                sx={{
                  "& .MuiBadge-badge": {
                    border: `2px solid ${"var(--mui-palette-text-secondary)"}`,
                    color: "var(--mui-palette-text-secondary)",
                    padding: "0",
                    borderWidth: "1px",
                  },
                }}
              />
            </span>
          ) : (
            <Box
              style={{
                visibility: index === status.length - 1 ? "visible" : "hidden",
                maxHeight: "24px",
              }}
              className="flex items-start justify-start gap-1"
            >
              {index === status.length - 1 && (
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    padding: 0,
                    maxWidth: "fit-content",
                    marginTop: "2px",
                  }}
                  onClick={onOpen}
                >
                  <Typography
                    variant="body2"
                    color="primary"
                    className="cursor-pointer lowercase p-[0px]"
                  >
                    {`+ ${status.length - 2} more`}
                  </Typography>
                </Button>
              )}
            </Box>
          )}
        </Fragment>
      ))}
    </div>
  );
}
