import { EntityStatus } from "@/models/types/dashboard";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

export type StatusDataDisplayProps = {
  status: EntityStatus;
};

export default function StatusDataDisplay({ status }: StatusDataDisplayProps) {
  const { mode } = useColorScheme();

  const [styles, setStyles] = useState({});

  const maintenanceStyles = {
    color: mode === "light" ? "#7C8100" : "#FFEF93",
    backgroundColor: mode === "light" ? "#FFEF93" : "#00000000",
    BorderColor: mode === "light" ? "#7C8100" : "#FFEF93",
  };

  const harvestingStyles = {
    color: mode === "light" ? "#89AC46" : "#C3FF99",
    backgroundColor: mode === "light" ? "#C3FF99" : "#00000000",
    BorderColor: mode === "light" ? "#89AC46" : "#C3FF99",
  };

  const vegetationStyles = {
    color: mode === "light" ? "#481E14" : "#F2613F",
    backgroundColor: mode === "light" ? "#F2613F" : "#00000000",
    BorderColor: mode === "light" ? "#481E14" : "#F2613F",
  };

  const ripeningStyles = {
    color: mode === "light" ? "#3B1C32" : "#DA0C81",
    backgroundColor: mode === "light" ? "#DA0C81" : "#00000000",
    BorderColor: mode === "light" ? "#3B1C32" : "#DA0C81",
  };

  const readyToHarvestStyles = {
    color: mode === "light" ? "#17153B" : "#3DC2EC",
    backgroundColor: mode === "light" ? "#3DC2EC" : "#00000000",
    BorderColor: mode === "light" ? "#17153B" : "#3DC2EC",
  };

  const harvestEndedStyles = {
    color: mode === "light" ? "#27374D" : "#9DB2BF",
    backgroundColor: mode === "light" ? "#9DB2BF" : "#00000000",
    BorderColor: mode === "light" ? "#27374D" : "#9DB2BF",
  };

  useEffect(() => {
    if (status && status.toLocaleLowerCase() === "maintenance") {
      setStyles(maintenanceStyles);
    }
    switch (status) {
      case VineyardStatus.MAINTENANCE:
        setStyles(maintenanceStyles);
        break;
      case VineyardStatus.VEGETATION:
        setStyles(vegetationStyles);
        break;
      case VineyardStatus.HARVESTING || status === GrapeStatus.PROCESSED:
        setStyles(harvestingStyles);
        break;
      case VineyardStatus.RIPPING || status === GrapeStatus.IN_TRANSIT:
        setStyles(ripeningStyles);
        break;
      case VineyardStatus.READY_FOR_HARVEST:
        setStyles(readyToHarvestStyles);
        break;
      case VineyardStatus.HARVEST_ENDED || GrapeStatus.FRIDGE_STORED:
        setStyles(harvestEndedStyles);
        break;
      default:
        setStyles({});
        break;
    }
  }, [mode]);

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
