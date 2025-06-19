/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityStatus } from "@/models/types/dashboard";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { Select, MenuItem, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { set } from "zod";

export type StatusDataDisplayProps = {
  status: EntityStatus;
  onSelect?: (status: EntityStatus) => void;
};

export default function StatusDataDisplaySelect({
  status,
  onSelect,
}: StatusDataDisplayProps) {
  const { mode } = useColorScheme();
  const [statuses, setStatuses] = useState<VineyardStatus[]>([]);
  const [selected, setSelected] = useState<VineyardStatus>(
    status as VineyardStatus
  );

  const handleChange = useCallback((e: any) => {
    setSelected(e.target.value);
    onSelect?.(e.target.value);
  }, []);

  useEffect(() => {
    setStatuses(Object.values(VineyardStatus));
  }, [VineyardStatus]);

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

const getStatusStyles = (status: EntityStatus, mode?: string) => {
  const isLight = mode === "light";

  const stylesMap: Partial<Record<EntityStatus, React.CSSProperties>> = {
    [VineyardStatus.MAINTENANCE]: {
      color: isLight ? "#7C8100" : "#FDFFC0",
      backgroundColor: isLight ? "#FDFFC0" : "#00000000",
      borderColor: isLight ? "#7C8100" : "#FDFFC0",
    },
    [VineyardStatus.VEGETATION]: {
      color: isLight ? "#5F2012" : "#FFBEAF",
      backgroundColor: isLight ? "#FFBEAF" : "#00000000",
      borderColor: isLight ? "#5F2012" : "#FFBEAF",
    },
    [VineyardStatus.HARVESTING]: {
      color: isLight ? "#479A3C" : "#C3FF99",
      backgroundColor: isLight ? "#DDFFD9" : "#00000000",
      borderColor: isLight ? "#479A3C" : "#C3FF99",
    },
    [GrapeStatus.PROCESSED]: {
      color: isLight ? "#479A3C" : "#C3FF99",
      backgroundColor: isLight ? "#DDFFD9" : "#00000000",
      borderColor: isLight ? "#479A3C" : "#C3FF99",
    },
    [VineyardStatus.RIPPING]: {
      color: isLight ? "#AC3580" : "#DA0C81",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#3B1C32" : "#DA0C81",
    },
    [GrapeStatus.IN_TRANSIT]: {
      color: isLight ? "#AC3580" : "#DA0C81",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#AC3580" : "#DA0C81",
    },
    [VineyardStatus.READY_FOR_HARVEST]: {
      color: isLight ? "#247566" : "#C2FFF4",
      backgroundColor: isLight ? "#C2FFF4" : "#00000000",
      borderColor: isLight ? "#247566" : "#C2FFF4",
    },
    [VineyardStatus.HARVEST_ENDED]: {
      color: isLight ? "#A3A3A1" : "#9DB2BF",
      backgroundColor: isLight ? "#E8E8E8" : "#00000000",
      borderColor: isLight ? "#A3A3A1" : "#9DB2BF",
    },
    [GrapeStatus.FRIDGE_STORED]: {
      color: isLight ? "#A3A3A1" : "#9DB2BF",
      backgroundColor: isLight ? "#E8E8E8" : "#00000000",
      borderColor: isLight ? "#A3A3A1" : "#9DB2BF",
    },
  };

  return stylesMap[status] ?? {};
};
