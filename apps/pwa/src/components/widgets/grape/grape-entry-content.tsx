import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { GrapeEntry } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import { formatNumberWithUnit } from "@/utils/number-format";

type GrapeEntryProps = {
  entry: GrapeEntry;
};

export default function GrapeEntryContent({ entry }: GrapeEntryProps) {
  const {
    grossWeight,
    grossUnit = "",
    netWeight,
    netUnit = "",
    tareWeight,
    tareUnit = "",
    weigherName,
    intakeDate,
  } = entry;

  return (
    <div className="grid grid-cols-5 w-full p-4 py-2">
      <SimpleDataDisplay
        label="Gross weight"
        value={
          grossWeight ? formatNumberWithUnit(grossWeight, grossUnit) : "N/A"
        }
      />
      <SimpleDataDisplay
        label="Net weight"
        value={netWeight ? formatNumberWithUnit(netWeight, netUnit) : "N/A"}
      />
      <SimpleDataDisplay
        label="Tare weight"
        value={tareWeight ? formatNumberWithUnit(tareWeight, tareUnit) : "N/A"}
      />
      <SimpleDataDisplay label="Weigher Name" value={weigherName ?? "N/A"} />
      <SimpleDataDisplay
        label="Grape Intake Date"
        value={intakeDate ? formatDate(intakeDate, { locale: "ro-RO" }) : "N/A"}
      />
    </div>
  );
}
