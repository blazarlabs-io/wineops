import LabsTable from "@/components/table/storage/labs-table";
import { MustLabData } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type LabsProps = {
  data: MustLabData[];
};

export default function LabsContent({ data }: LabsProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <LabsTable data={data} />
    </Stack>
  );
}
