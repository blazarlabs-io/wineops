import BulkInfoTable from "@/components/table/bulks/bulk-info-table";
import { BulkInfo } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type BulkInfoProps = {
  data: BulkInfo[];
};

export default function BulkInfoContent({ data }: BulkInfoProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <BulkInfoTable data={data} />
    </Stack>
  );
}
