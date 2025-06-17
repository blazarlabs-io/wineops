import WineInfoTable from "@/components/table/wines/wine-info-table";
import { WineInfo } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type WineInfoProps = {
  data: WineInfo[];
};

export default function WineInfoContent({ data }: WineInfoProps) {
  return (
    <Stack sx={{ height: "100%", overflow: "auto" }}>
      <WineInfoTable data={data} />
    </Stack>
  );
}
