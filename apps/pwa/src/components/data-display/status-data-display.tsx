import { EntityStatus } from "@/models/types/dashboard";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { SupportedColorScheme, useColorScheme } from "@mui/material/styles";

type StatusDataDisplayProps = {
  status: EntityStatus;
};

export default function StatusDataDisplay({ status }: StatusDataDisplayProps) {
  const { colorScheme } = useColorScheme();

  const styles = getStatusStyles(status, colorScheme);

  return (
    <>
      {status && (
        <span
          style={styles}
          className="border max-h-fit max-w-fit flex items-center justify-center text-xs font-semibold rounded-full px-2 py-1"
        >
          {status.toUpperCase()}
        </span>
      )}
    </>
  );
}

const getStatusStyles = (
  status: EntityStatus,
  colorScheme?: SupportedColorScheme,
) => {
  const isLight = colorScheme === "light";

  const stylesMap: Partial<Record<EntityStatus, React.CSSProperties>> = {
    [VineyardStatus.MAINTENANCE]: {
      color: isLight ? "#7C8100" : "#FFEF93",
      backgroundColor: isLight ? "#FFEF93" : "#00000000",
      borderColor: isLight ? "#7C8100" : "#FFEF93",
    },
    [VineyardStatus.VEGETATION]: {
      color: isLight ? "#481E14" : "#F2613F",
      backgroundColor: isLight ? "#F2613F" : "#00000000",
      borderColor: isLight ? "#481E14" : "#F2613F",
    },
    [VineyardStatus.HARVESTING]: {
      color: isLight ? "#479A3C" : "#C3FF99",
      backgroundColor: isLight ? "#DDFFD9" : "#00000000",
      borderColor: isLight ? "#479A3C" : "#C3FF99",
    },
    [GrapeStatus.PROCESSED]: {
      color: isLight ? "#479A3C" : "#C3FF99",
      backgroundColor: isLight ? "#DDFFD9" : "#00000000",
      borderColor: isLight ? "#479A3C" : "#C3FF99",
    },
    [VineyardStatus.RIPPING]: {
      color: isLight ? "#AC3580" : "#DA0C81",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#3B1C32" : "#DA0C81",
    },
    [GrapeStatus.IN_TRANSIT]: {
      color: isLight ? "#AC3580" : "#DA0C81",
      backgroundColor: isLight ? "#F9D9ED" : "#00000000",
      borderColor: isLight ? "#AC3580" : "#DA0C81",
    },
    [VineyardStatus.READY_FOR_HARVEST]: {
      color: isLight ? "#17153B" : "#3DC2EC",
      backgroundColor: isLight ? "#3DC2EC" : "#00000000",
      borderColor: isLight ? "#17153B" : "#3DC2EC",
    },
    [VineyardStatus.HARVEST_ENDED]: {
      color: isLight ? "#A3A3A1" : "#9DB2BF",
      backgroundColor: isLight ? "#E8E8E8" : "#00000000",
      borderColor: isLight ? "#A3A3A1" : "#9DB2BF",
    },
    [GrapeStatus.FRIDGE_STORED]: {
      color: isLight ? "#A3A3A1" : "#9DB2BF",
      backgroundColor: isLight ? "#E8E8E8" : "#00000000",
      borderColor: isLight ? "#A3A3A1" : "#9DB2BF",
    },
  };

  return stylesMap[status] ?? {};
};
