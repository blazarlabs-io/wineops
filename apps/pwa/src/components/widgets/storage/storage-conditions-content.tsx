import StorageConditionsTable from "@/components/table/storage/storage-conditions-table";
import { StorageCondition } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type StorageConditionsProps = {
  data: StorageCondition[];
};

export default function StorageConditionsContent({
  data,
}: StorageConditionsProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <StorageConditionsTable data={data} />
    </Stack>
  );
}
