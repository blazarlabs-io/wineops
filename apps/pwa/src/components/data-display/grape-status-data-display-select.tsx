/* eslint-disable @typescript-eslint/no-explicit-any */
import { vineyardStatus } from "@/data/system-variables";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export type StatusDataDisplayProps = {
  status: GrapeStatus;
  onSelect?: (status: GrapeStatus) => void;
};

export default function GrapeStatusDataDisplaySelect({
  status,
  onSelect,
}: StatusDataDisplayProps) {
  const [statuses, setStatuses] = useState<GrapeStatus[]>([]);
  const [selected, setSelected] = useState<GrapeStatus>(status as GrapeStatus);

  const handleChange = useCallback(
    (e: any) => {
      setSelected(e.target.value);
      onSelect?.(e.target.value);
    },
    [onSelect]
  );

  useEffect(() => {
    if (vineyardStatus) setStatuses(Object.values(GrapeStatus));
  }, []);

  useEffect(() => {
    setSelected(status as GrapeStatus);
  }, [status]);

  return (
    <>
      {status && selected && statuses && (
        <Select
          size="small"
          value={(selected as any) || ""}
          variant="outlined"
          onChange={handleChange}
          sx={{
            minWidth: "fit-content",
            borderRadius: "6px",
          }}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              <Typography variant="caption">{s.toUpperCase()}</Typography>
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
}
