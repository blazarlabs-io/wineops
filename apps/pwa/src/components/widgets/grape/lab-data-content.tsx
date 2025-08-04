import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { GrapeLabData } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import {
  formatNumberWithLowerCaseUnitAndSpace,
  formatNumberWithUnit,
  formatNumberWithUnitAndSpace,
} from "@/utils/number-format";

type LabDataProps = {
  labData: GrapeLabData;
};

export default function LabDataContent({ labData }: LabDataProps) {
  const {
    date,
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
    <div className="grid grid-cols-4 w-full py-2 items-center justify-center">
      <SimpleDataDisplay
        label="Sugar"
        value={
          sugar?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">
                {formatNumberWithLowerCaseUnitAndSpace(
                  sugar.value,
                  sugar?.unit ?? "g/dm³",
                )}
              </span>
            </div>
          ) : (
            "N/A"
          )
        }
      />
      <SimpleDataDisplay
        label="Acidity"
        value={
          acidity?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">
                {formatNumberWithLowerCaseUnitAndSpace(
                  acidity.value,
                  acidity?.unit ?? "g/dm³",
                )}
              </span>
            </div>
          ) : (
            "N/A"
          )
        }
      />
      <SimpleDataDisplay
        label="Density"
        value={
          density?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">
                {formatNumberWithUnitAndSpace(
                  density.value,
                  density?.unit ?? "kg/L",
                )}
              </span>
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
                {formatNumberWithUnitAndSpace(
                  temperature.value,
                  temperature.unit ?? "°C",
                )}
              </span>
            </div>
          ) : (
            "N/A"
          )
        }
      />
      <SimpleDataDisplay
        label="(%) of grapes affected by diseases and pests"
        value={formatNumberWithUnit(spoiledGrapesPercentage, "%") ?? "N/A"}
      />
      <SimpleDataDisplay
        label="(%) of crushed grapes"
        value={formatNumberWithUnit(crushedGrapesPercentage, "%") ?? "N/A"}
      />
      <SimpleDataDisplay
        label="(%) of mixed grape varieties"
        value={
          formatNumberWithUnit(addedGrapesVarietiesPercentage, "%") ?? "N/A"
        }
      />
      <span></span>

      <SimpleDataDisplay
        label="Last Lab Result Date"
        value={date ? formatDate(date) : "N/A"}
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
