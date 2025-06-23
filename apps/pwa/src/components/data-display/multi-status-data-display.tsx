import { SortedVineyardStatus } from "@/hooks/use-sort-vineyard-statuses";
import { Badge, Box, Button, Tooltip, Typography } from "@mui/material";
import { Fragment } from "react";

export type StatusDataDisplayProps = {
  status: SortedVineyardStatus[];
  onOpen?: () => void;
};

export default function MultiStatusDataDisplay({
  status,
  onOpen,
}: StatusDataDisplayProps) {
  return (
    <>
      {status && status.length > 0 && (
        <div>
          {status.map((s, index) => (
            <Fragment key={s.name}>
              {index < 2 ? (
                <span className="max-h-fit max-w-fit flex items-center justify-center text-xs font-semibold rounded-full px-2 py-[2px] gap-5">
                  {s.name.toUpperCase()}
                  <Badge
                    overlap="circular"
                    badgeContent={s.count}
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
                    visibility:
                      index === status.length - 1 ? "visible" : "hidden",
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
                        className="underline cursor-pointer lowercase p-[0px]"
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
      )}
    </>
  );
}
