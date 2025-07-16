import { cn } from "@/utils/styling";
import { Avatar, Card, Typography } from "@mui/material";

export type ResponsibleTeamMemberDataDisplayProps = {
  label: string;
  name: string;
  avatar: string;
};

export default function ResponsibleTeamMemberDataDisplay({
  label,
  name,
  avatar,
}: ResponsibleTeamMemberDataDisplayProps) {
  return (
    <Card
      variant="outlined"
      className={cn("min-w-[168px] flex flex-col gap-1 w-full p-2")}
    >
      <Typography variant="body2" color="textDisabled">
        {label}
      </Typography>
      <div className="flex items-center gap-2">
        <Avatar src={avatar} className="w-6! h-6!" />
        <Typography variant="body1">{name}</Typography>
      </div>
    </Card>
  );
}
