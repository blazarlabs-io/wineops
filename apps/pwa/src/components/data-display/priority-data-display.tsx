import { Priority, TaskStatus } from "@/models/types/db";
import {
  SupportedColorScheme,
  Typography,
  useColorScheme,
} from "@mui/material";
import { useEffect, useState } from "react";

export type PriorityDataDisplayProps = {
  status: Priority;
};

export default function PriorityDataDisplay({
  status,
}: PriorityDataDisplayProps) {
  const { colorScheme } = useColorScheme();
  const [statuses, setStatuses] = useState<Priority[]>([]);
  const [selected] = useState<Priority>(status as Priority);

  console.log(status);

  useEffect(() => {
    setStatuses(Object.values(Priority));
    console.log("STATUSES", Object.values(Priority));
  }, [Priority]);

  return (
    <div
      style={{ ...getStatusStyles(selected, colorScheme) }}
      className="border px-2 rounded-full text-xs"
    >
      <Typography variant="body2">{selected}</Typography>
    </div>
  );
}

const getStatusStyles = (
  status: Priority,
  colorScheme?: SupportedColorScheme
) => {
  const isLight = colorScheme === "light";

  const stylesMap: Partial<Record<Priority, React.CSSProperties>> = {
    [Priority.LOW]: {
      color: isLight ? "#1f4213" : "#9dfa7d",
      backgroundColor: isLight ? "#9dfa7d" : "#00000000",
      borderColor: isLight ? "#1f4213" : "#9dfa7d",
    },
    [Priority.MEDIUM]: {
      color: isLight ? "#363307" : "#fff980",
      backgroundColor: isLight ? "#fff980" : "#00000000",
      borderColor: isLight ? "#363307" : "#fff980",
    },
    [Priority.HIGH]: {
      color: isLight ? "#ffa716" : "#ffdea8",
      backgroundColor: isLight ? "#ffdea8" : "#00000000",
      borderColor: isLight ? "#ffa716" : "#ffdea8",
    },
    [Priority.URGENT]: {
      color: isLight ? "#ff3707" : "#f7a49e",
      backgroundColor: isLight ? "#f7a49e" : "#00000000",
      borderColor: isLight ? "#ff3707" : "#f7a49e",
    },
  };

  return stylesMap[status] ?? {};
};
