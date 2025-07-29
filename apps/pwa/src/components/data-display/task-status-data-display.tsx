
import { EntityStatus } from "@/models/types/dashboard";
import {
  GrapeStatus,
  Priority,
  TaskStatus,
  VineyardStatus,
} from "@/models/types/db";
import { MenuItem, Select, Typography } from "@mui/material";
import { SupportedColorScheme, useColorScheme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

type TaskStatusDataDisplayProps = {
  status: TaskStatus;
  onSelect?: (status: EntityStatus) => void;
};

export default function TaskStatusDataDisplay({
  status,
  onSelect,
}: TaskStatusDataDisplayProps) {
  const { colorScheme } = useColorScheme();
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [selected, setSelected] = useState<TaskStatus>(status as TaskStatus);

  const handleChange = useCallback((e: any) => {
    setSelected(e.target.value);
    onSelect?.(e.target.value);
  }, []);

  useEffect(() => {
    setStatuses(Object.values(TaskStatus));
  }, [TaskStatus]);

  return (
    <>
      {status && selected && statuses && (
        <Select
          size="small"
          value={selected}
          variant="outlined"
          onChange={handleChange}
          sx={{
            ...getStatusStyles(selected, colorScheme),
            minWidth: "fit-content",
            borderRadius: "6px",
          }}
        >
          {statuses.map((s) => (
            <MenuItem
              key={s}
              value={s}
              sx={{ ...getStatusStyles(s, colorScheme) }}
            >
              <Typography variant="caption">{s.toUpperCase()}</Typography>
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
}

const getStatusStyles = (
  status: TaskStatus,
  colorScheme?: SupportedColorScheme
) => {
  const isLight = colorScheme === "light";

  const stylesMap: Partial<Record<TaskStatus, React.CSSProperties>> = {
    [TaskStatus.NEW]: {
      color: isLight ? "#7C8100" : "#FDFFC0",
      backgroundColor: isLight ? "#FDFFC0" : "#00000000",
      borderColor: isLight ? "#7C8100" : "#FDFFC0",
    },
    [TaskStatus.PENDING]: {
      color: isLight ? "#5F2012" : "#FFBEAF",
      backgroundColor: isLight ? "#FFBEAF" : "#00000000",
      borderColor: isLight ? "#5F2012" : "#FFBEAF",
    },
    [TaskStatus["IN-PROGRESS"]]: {
      color: isLight ? "#479A3C" : "#C3FF99",
      backgroundColor: isLight ? "#DDFFD9" : "#00000000",
      borderColor: isLight ? "#479A3C" : "#C3FF99",
    },
    [TaskStatus.DONE]: {
      color: isLight ? "#3480eb" : "#a6c7f5",
      backgroundColor: isLight ? "#a6c7f5" : "#00000000",
      borderColor: isLight ? "#3480eb" : "#a6c7f5",
    },
    [TaskStatus.OVERDUE]: {
      color: isLight ? "#fc3f65" : "#fc3f65",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#3B1C32" : "#fc3f65",
    },
    [TaskStatus.BLOCKED]: {
      color: isLight ? "#AC3580" : "#DA0C81",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#3B1C32" : "#DA0C81",
    },
  };

  return stylesMap[status] ?? {};
};
