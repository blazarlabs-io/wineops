import LabItem from "@/components/data-display/lab-item";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import UnitDisplay from "@/components/data-display/unit-display";
import { WineLabData } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Box from "@mui/material/Box";

type LabDataProps = {
  labData?: WineLabData;
};

export default function LabDataContent({ labData }: LabDataProps) {
  const {
    date,
    sugar,
    acidity,
    alcohol,
    temperature,
    totalSO2,
    freeSO2,
    volatileAcidity,
    labCertificateID,
    labTechnicianName,
  } = labData ?? {};

  return (
    <div className="grid grid-cols-5 w-full py-2 items-center justify-center">
      <SimpleDataDisplay label="Date" value={date ? formatDate(date) : "N/A"} />

      <SimpleDataDisplay
        label="Temperature"
        value={
          temperature?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">{temperature.value}</span>
              <UnitDisplay unit={temperature.unit ?? ""} />
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <Box p={1.5}>
        <LabItem label="Alcohol" data={alcohol} />
      </Box>

      <Box p={1.5}>
        <LabItem label="Sugar" data={sugar} />
      </Box>

      <Box p={1.5}>
        <LabItem label="Acidity" data={acidity} />
      </Box>

      <SimpleDataDisplay
        label="Total SO₂"
        value={
          totalSO2?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">{totalSO2.value}</span>
              <UnitDisplay unit={totalSO2.unit ?? ""} />
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <SimpleDataDisplay
        label="Free SO₂"
        value={
          freeSO2?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">{freeSO2.value}</span>
              <UnitDisplay unit={freeSO2.unit ?? ""} />
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <SimpleDataDisplay
        label="Volatile Acidity"
        value={
          volatileAcidity?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">
                {volatileAcidity.value}
              </span>
              <UnitDisplay unit={volatileAcidity.unit ?? ""} />
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <SimpleDataDisplay
        label="Lab technician name"
        value={labTechnicianName ?? "N/A"}
      />

      <SimpleDataDisplay
        label="Lab Certificate ID"
        value={labCertificateID ?? "N/A"}
      />
    </div>
  );
}
