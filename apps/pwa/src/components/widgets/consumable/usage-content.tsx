import UsageTable from "@/components/table/consumables/usage-table";
import { ConsumableUsage } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type UsageProps = {
  usage: ConsumableUsage[];
};

export default function UsageContent({ usage }: UsageProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <UsageTable data={usage} />
    </Stack>
  );
}
