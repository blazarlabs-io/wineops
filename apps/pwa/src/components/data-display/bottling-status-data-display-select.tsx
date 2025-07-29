/* eslint-disable @typescript-eslint/no-explicit-any */
import { LotStatus } from "@/models/types/db";
import { MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export type BottlingStatusDataDisplayProps = {
  status: LotStatus;
  onSelect?: (status: LotStatus) => void;
};

export default function BottlingStatusDataDisplaySelect({
  status,
  onSelect,
}: BottlingStatusDataDisplayProps) {
  const [statuses, setStatuses] = useState<LotStatus[]>([]);
  const [selected, setSelected] = useState<LotStatus>(status as LotStatus);

  const handleChange = useCallback((e: any) => {
    setSelected(e.target.value);
    onSelect?.(e.target.value);
  }, []);

  useEffect(() => {
    setStatuses(Object.values(LotStatus));
  }, [LotStatus]);

  useEffect(() => {
    setSelected(status as LotStatus);
  }, [status]);

  return (
    <>
      {status && selected && statuses && (
        <Select
          size="small"
          value={selected}
          variant="outlined"
          onChange={handleChange}
          sx={{
            // ...getStatusStyles(selected, mode),
            minWidth: "fit-content",
            borderRadius: "6px",
          }}
        >
          {statuses.map((s) => (
            <MenuItem
              key={s}
              value={s}
              // sx={{ ...getStatusStyles(s, mode) }}
            >
              <Typography variant="caption">{s.toUpperCase()}</Typography>
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
}
