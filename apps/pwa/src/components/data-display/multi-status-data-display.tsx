import { SortedVineyardStatus } from "@/hooks/use-sort-vineyard-statuses";
import { Badge, Box, Tooltip, Typography } from "@mui/material";

export type StatusDataDisplayProps = {
  status: SortedVineyardStatus[];
};

export default function MultiStatusDataDisplay({
  status,
}: StatusDataDisplayProps) {
  return (
    <>
      {status && status.length > 0 && (
        <div>
          {status.map((s, index) => (
            <>
              {index < 3 ? (
                <span
                  key={s.name}
                  className="max-h-fit max-w-fit flex items-center justify-center text-xs font-semibold rounded-full px-2 py-[2px] gap-5"
                >
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
                    <Tooltip title={status.map((s) => s.name).join(", ")} arrow>
                      <Typography
                        key={s.name}
                        variant="body2"
                        color="primary"
                        className="underline cursor-pointer"
                      >
                        {`+ ${status.length - 3} more`}
                      </Typography>
                    </Tooltip>
                  )}
                </Box>
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
}
