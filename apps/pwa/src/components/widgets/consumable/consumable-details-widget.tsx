import { Consumable } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import GeneralInfoContent from "./general-info-content";
import TechnicalInfoContent from "./technical-info-content";
import UsageContent from "./usage-content";

export type ConsumableDetailsWidgetProps = {
  consumable: Consumable;
};

export default function ConsumableDetailsWidget({
  consumable,
}: ConsumableDetailsWidgetProps) {
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
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Consumable details"
        sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
      >
        <Tab label={"General Info"} {...a11yProps(0)} />
        <Tab label="Technical Info" {...a11yProps(1)} />
        <Tab label="Usage" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <GeneralInfoContent data={consumable} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TechnicalInfoContent data={consumable} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <UsageContent usage={consumable?.usage || []} />
      </TabPanel>
    </Box>
  );
}
