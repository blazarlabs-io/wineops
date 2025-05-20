import { EntityStatus } from "@/models/types/dashboard";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { cn } from "@/utils/styling";

export type StatusDataDisplayProps = {
  status: EntityStatus;
};

export default function StatusDataDisplay({ status }: StatusDataDisplayProps) {
  if (!status) return null;

  return (
    <div
      className={cn(
        "border max-h-fit max-w-fit flex items-center justify-center text-xs font-semibold rounded-full px-2 py-1",
        status === VineyardStatus.MAINTENANCE &&
          "border-[#7C8100] bg-[#FFEF93] text-[#7C8100]",
        (status === VineyardStatus.RIPPING ||
          status === GrapeStatus.IN_TRANSIT) &&
          "border-[#AC3580] bg-[#F9D9ED] text-[#AC3580]",
        status === VineyardStatus.VEGETATION &&
          "border-[#FFAE52] bg-[#F9E6D1] text-[#FFAE52]",
        status === VineyardStatus.READY_FOR_HARVEST &&
          "border-[#35C8D2] bg-[#D9E8E9] text-[#35C8D2]",
        (status === VineyardStatus.HARVESTING ||
          status === GrapeStatus.PROCESSED) &&
          "border-[#00C950] bg-[#e7f9d9] text-[#00C950]",
        (status === VineyardStatus.HARVEST_ENDED ||
          status === GrapeStatus.FRIDGE_STORED) &&
          "border-[#A3A3A1] bg-[#E8E8E8] text-[#A3A3A1]"
      )}
    >
      {status.toUpperCase()}
    </div>
  );
}
