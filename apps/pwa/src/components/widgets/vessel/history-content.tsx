import HistoryTable from "@/components/table/vessel/history-table";
import { VesselHistory, VesselType } from "@/models/types/db";
import Stack from "@mui/material/Stack";

type HistoryProps = {
  type?: VesselType;
  history: VesselHistory[];
};

export default function HistoryContent({ type, history }: HistoryProps) {
  return (
    <Stack>
      <HistoryTable type={type} data={history} />
    </Stack>
  );
}
