/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityStatus } from "@/models/types/dashboard";
import { GrapeStatus, VineyardStatus } from "@/models/types/db";
import { Select, MenuItem, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

export type StatusDataDisplayProps = {
  status: EntityStatus;
};

export default function StatusDataDisplay({ status }: StatusDataDisplayProps) {
  const { mode } = useColorScheme();
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<VineyardStatus[]>([]);

  const styles = getStatusStyles(status, mode);

  const handleOpen = (e: any) => {
    setOpen(e.target.value);
  };

  useEffect(() => {
    console.log("VineyardStatus", Object.entries(VineyardStatus));
  }, [VineyardStatus]);

  return (
    <>
      {status && (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={"MAINTAINANCE"}
          // label="Age"
          onChange={handleOpen}
          sx={{
            ...styles,
            border: "none",
            // fontSize: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-input": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              border: "none",
            },
            "& .MuiSelect-select": {
              border: "none",
            },
          }}
        >
          <MenuItem value={"MAINTAINANCE"} sx={{ ...styles }}>
            <Typography variant="caption">MAINTAINANCE</Typography>
          </MenuItem>
          <MenuItem
            value={"HARVESTING"}
            sx={{ ...getStatusStyles("Harvesting", mode) }}
          >
            <Typography variant="caption">HARVESTING</Typography>
          </MenuItem>
        </Select>
        // <div className="flex flex-col debug-red w-[164px] h-full">
        //   <div
        //     style={styles}
        //     onClick={handleOpen}
        //     className="hover:brightness-70! transition-all duration-150 ease-in-out cursor-pointer border max-h-fit max-w-fit flex items-center justify-center text-xs font-semibold rounded-full px-2 py-1"
        //   >
        //     <p>{status.toUpperCase()}</p>
        //   </div>
        //   {open && (
        //     <div className="w-full h-full bg-[#00C950] rounded-l-md z-100" />
        //   )}
        // </div>
      )}
    </>
  );
}

const getStatusStyles = (status: EntityStatus, mode?: string) => {
  const isLight = mode === "light";

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
