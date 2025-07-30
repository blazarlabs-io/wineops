import QtyTable from "@/components/table/musts/qty-table";
import { QtyInfo } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type QtyProps = {
  data: QtyInfo[];
};

export default function QtyContent({ data }: QtyProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <QtyTable data={data} />
    </Stack>
  );
}
