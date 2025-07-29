import { ReactNode } from "react";
import { Card, Typography } from "@mui/material";
import { cn } from "@/utils/styling";

type SimpleDataDisplayProps = {
  label: ReactNode;
  value: ReactNode;
  classNames?: string;
};

export default function SimpleDataDisplay({
  label,
  value,
  classNames = "",
}: SimpleDataDisplayProps) {
  return (
    <Card
      variant="outlined"
      className={cn("min-w-[168px] flex flex-col gap-1 w-full p-2", classNames)}
    >
      <Typography variant="body2" color="textDisabled">
        {label}
      </Typography>
      <Typography component="span">{value}</Typography>
    </Card>
  );
}
