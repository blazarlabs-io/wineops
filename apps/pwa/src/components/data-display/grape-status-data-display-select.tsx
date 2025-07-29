import { GrapeStatus } from "@/models/types/db";
import { MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type StatusDataDisplayProps = {
  status: GrapeStatus;
  onSelect?: (status: GrapeStatus) => void;
};

export default function GrapeStatusDataDisplaySelect({
  status,
  onSelect,
}: StatusDataDisplayProps) {
  const [selected, setSelected] = useState<GrapeStatus>(status as GrapeStatus);

  const handleChange = useCallback(
    ({ target }: SelectChangeEvent<GrapeStatus>) => {
      setSelected(target.value);
      onSelect?.(target.value);
    },
    [onSelect],
  );

  useEffect(() => {
    setSelected(status as GrapeStatus);
  }, [status]);

  const statuses = Object.values(GrapeStatus);

  if (!status || !selected || statuses?.length === 0) return null;

  return (
    <Select<GrapeStatus>
      size="small"
      value={selected || ""}
      variant="outlined"
      onChange={handleChange}
      sx={{
        width: "fit-content",
        borderRadius: "6px",
      }}
    >
      {statuses.map((s) => (
        <MenuItem key={s} value={s}>
          <Typography variant="caption">{s.toUpperCase()}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
}
