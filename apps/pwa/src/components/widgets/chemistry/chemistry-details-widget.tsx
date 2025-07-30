import { Chemistry } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import GeneralInfoContent from "./general-info-content";
import SupplyContent from "./supply-content";
import UsageContent from "../components/usage-content";

type ChemistryDetailsWidgetProps = {
  chemistryItem: Chemistry;
};

export default function ChemistryDetailsWidget({
  chemistryItem,
}: ChemistryDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
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
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Chemistry item details"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          paddingX: 2,
        }}
      >
        <Tab label="General Info" {...a11yProps(0)} sx={sx} />
        <Tab label="Supply" {...a11yProps(1)} sx={sx} />
        <Tab label="Usage" {...a11yProps(2)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <GeneralInfoContent data={chemistryItem} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SupplyContent data={chemistryItem} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <UsageContent usage={chemistryItem?.usage || []} />
      </TabPanel>
    </Box>
  );
}
