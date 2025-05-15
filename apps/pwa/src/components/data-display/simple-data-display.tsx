import { Card, Paper, Typography } from "@mui/material";

export type SimpleDataDisplayProps = {
  label: string;
  value: string;
};

export default function SimpleDataDisplay({
  label,
  value,
}: SimpleDataDisplayProps) {
  return (
    <Card
      variant="outlined"
      className="min-w-[168px] flex flex-col gap-1 w-full p-2"
    >
      <Typography variant="body2" color="textDisabled">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Card>
  );
}
