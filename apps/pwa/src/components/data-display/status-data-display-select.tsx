import { vineyardStatus } from "@/data/system-variables";
import { VineyardStatus } from "@/models/types/db";
import { MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type StatusDataDisplayProps = {
  status: VineyardStatus;
  onSelect?: (status: VineyardStatus) => void;
};

export default function StatusDataDisplaySelect({
  status,
  onSelect,
}: StatusDataDisplayProps) {
  const [statuses, setStatuses] = useState<VineyardStatus[]>([]);
  const [selected, setSelected] = useState<VineyardStatus>(
    status as VineyardStatus,
  );

  const handleChange = useCallback(
    (e: any) => {
      setSelected(e.target.value);
      onSelect?.(e.target.value);
    },
    [onSelect],
  );

  useEffect(() => {
    if (vineyardStatus) setStatuses(Object.values(VineyardStatus));
  }, []);

  useEffect(() => {
    setSelected(status as VineyardStatus);
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
