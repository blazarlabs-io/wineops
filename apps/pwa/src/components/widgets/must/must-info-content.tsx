import MustInfoTable from "@/components/table/musts/must-info-table";
import { MustInfo } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type MustInfoProps = {
  data: MustInfo[];
};

export default function MustInfoContent({ data }: MustInfoProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <MustInfoTable data={data} />
    </Stack>
  );
}
