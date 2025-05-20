import LabItem from "@/components/data-display/lab-item";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import UnitDisplay from "@/components/data-display/unit-display";
import { GrapeLabData } from "@/models/types/db";
import { formatNumberWithUnit } from "@/utils/number-format";
import Stack from "@mui/material/Stack";
import Link from "next/link";

type LabDataProps = {
  labData: GrapeLabData;
};

export default function LabDataContent({ labData }: LabDataProps) {
  const {
    sugar,
    acidity,
    density,
    temperature,
    labCertificateID,
    labTechnicianName,
    spoiledGrapesPercentage,
    crushedGrapesPercentage,
    addedGrapesVarietiesPercentage,
  } = labData ?? {};

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "flex-end", lineHeight: 1 }}>
        <Link href="" className="underline">
          Attach a document
        </Link>
      </Stack>

      {labData && (
        <div className="grid grid-cols-5 w-full p-4 gap-4">
          <LabItem label="Sugar" data={sugar ?? { value: "N/A" }} />
          <LabItem label="Acidity" data={acidity ?? { value: "N/A" }} />
          <SimpleDataDisplay
            label="Density"
            value={
              density?.value ? (
                <div className="flex items-start gap-1">
                  <span className="text-muted-foreground">{density.value}</span>
                  <UnitDisplay unit={density.unit ?? ""} />
                </div>
              ) : (
                "N/A"
              )
            }
          />
          <SimpleDataDisplay
            label="Temperature (at the grape input time)"
            value={
              temperature?.value ? (
                <div className="flex items-start gap-1">
                  <span className="text-muted-foreground">
                    {temperature.value}
                  </span>
                  <UnitDisplay unit={temperature.unit ?? ""} />
                </div>
              ) : (
                "N/A"
              )
            }
          />
          <SimpleDataDisplay
            label="% of the spoiled grapes"
            value={formatNumberWithUnit(spoiledGrapesPercentage, "%") ?? "N/A"}
          />
          <SimpleDataDisplay
            label="% of crushed grapes"
            value={formatNumberWithUnit(crushedGrapesPercentage, "%") ?? "N/A"}
          />
          <SimpleDataDisplay
            label="% of other grape varieties added"
            value={
              formatNumberWithUnit(addedGrapesVarietiesPercentage, "%") ?? "N/A"
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
      )}
    </Stack>
  );
}
