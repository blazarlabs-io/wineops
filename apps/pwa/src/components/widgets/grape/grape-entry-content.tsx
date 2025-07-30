import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { DEFAULT_LOCALE } from "@/data/constants";
import { GrapeEntry, ProcessingInfo } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import { formatNumberWithLowerCaseUnitAndSpace } from "@/utils/number-format";

type GrapeEntryProps = {
  entry: GrapeEntry;
  processingInfo: ProcessingInfo;
};

export default function GrapeEntryContent({
  entry,
  processingInfo,
}: GrapeEntryProps) {
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
    <div className="grid grid-cols-4 w-full p-0 py-2">
      <SimpleDataDisplay
        label="Grape Intake Date"
        value={
          intakeDate
            ? formatDate(intakeDate, { locale: DEFAULT_LOCALE })
            : "N/A"
        }
      />

      <SimpleDataDisplay
        label="Net weight"
        value={
          netWeight
            ? formatNumberWithLowerCaseUnitAndSpace(netWeight, netUnit || "kg")
            : "N/A"
        }
      />

      <SimpleDataDisplay
        label="Tare weight"
        value={
          tareWeight
            ? formatNumberWithLowerCaseUnitAndSpace(
                tareWeight,
                tareUnit || "kg",
              )
            : "N/A"
        }
      />

      <SimpleDataDisplay
        label="Gross weight"
        value={
          grossWeight
            ? formatNumberWithLowerCaseUnitAndSpace(
                grossWeight,
                grossUnit || "kg",
              )
            : "N/A"
        }
      />

      <SimpleDataDisplay label="Weigher Name" value={weigherName ?? "N/A"} />

      <SimpleDataDisplay
        label="Receiving Bay"
        value={processingInfo.receivingBay || "N/A"}
      />

      <SimpleDataDisplay
        label="Destemmer"
        value={processingInfo.destemmer || "N/A"}
      />

      <SimpleDataDisplay
        label="Press (used)"
        value={processingInfo.pressUsed || "N/A"}
      />
    </div>
  );
}
