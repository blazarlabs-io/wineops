import { Vessel, VesselType } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import SstInfoContent from "./sst-info-content";
import BarrelInfoContent from "./barrel-info-content";
import HistoryContent from "./history-content";

export type VesselDetailsWidgetProps = {
  vessel: Vessel;
};

export default function VesselDetailsWidget({
  vessel,
}: VesselDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vessel details"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab
          label={
            vessel?.type === VesselType.BARREL
              ? "Barrel History"
              : vessel?.type === VesselType.STAINLESS_STEEL_TANK
                ? "Stainless Steel Tank History"
                : "History"
          }
          {...a11yProps(0)}
        />
        <Tab label="Technical info" {...a11yProps(1)} />
        <Tab label="Tasks" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <HistoryContent type={vessel?.type} history={vessel?.history || []} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        {vessel?.type === VesselType.BARREL && (
          <BarrelInfoContent data={vessel.barrelInfo ?? {}} />
        )}
        {vessel?.type === VesselType.STAINLESS_STEEL_TANK && (
          <SstInfoContent data={vessel.sstInfo ?? {}} />
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className="flex gap-8 px-4">Task View</div>
      </TabPanel>
    </Box>
  );
}
