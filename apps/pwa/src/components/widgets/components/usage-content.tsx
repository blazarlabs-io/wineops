import UsageTable from "@/components/table/consumables/usage-table";
import { ExpendableUsage } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type UsageProps = {
  usage: ExpendableUsage[];
};

export default function UsageContent({ usage }: UsageProps) {
  return (
    <Stack>
      <UsageTable data={usage} />
    </Stack>
  );
}
