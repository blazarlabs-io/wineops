import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { ProcessingInfo } from "@/models/types/db";

type ProcessingInfoProps = {
  processingInfo: ProcessingInfo;
};

export default function ProcessingInfoContent({
  processingInfo,
}: ProcessingInfoProps) {
  if (!processingInfo) return null;

  return (
    <div className="grid grid-cols-4 w-full p-4 py-2">
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
      <SimpleDataDisplay
        label="Vessel Used"
        value={processingInfo.vesselUsed || "N/A"}
      />
    </div>
  );
}
