import { ReactNode } from "react";
import { Card, Typography } from "@mui/material";

type SimpleDataDisplayProps = {
  label: ReactNode;
  value: ReactNode;
};

export default function OrientationDataDisplay({
  label,
  value,
}: SimpleDataDisplayProps) {
  return (
    <Card
      variant="outlined"
      className="min-w-[168px] flex flex-col gap-1 w-full p-2 capitalize"
    >
      <Typography variant="body2" color="textDisabled">
        {label}
      </Typography>
      <Typography component="span">{value}</Typography>
    </Card>
  );
}
