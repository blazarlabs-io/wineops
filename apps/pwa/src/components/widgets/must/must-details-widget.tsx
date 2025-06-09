import { Must } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import LabDataContent from "./lab-data-content";
import MustInfoContent from "./must-info-content";
import QtyContent from "./qty-content";

export type MustDetailsWidgetProps = {
  must: Must;
};

export default function MustDetailsWidget({ must }: MustDetailsWidgetProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const qty = must?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0);

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
        aria-label="Must details"
        sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
      >
        <Tab label="Lab Data" {...a11yProps(0)} />
        <Tab label="Must&nbsp;Info" {...a11yProps(1)} />
        <Tab label="Timeline" {...a11yProps(2)} />
        <Tab label="Quantity" {...a11yProps(3)} />
        <Tab label="Tasks" {...a11yProps(4)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LabDataContent labData={must.labData} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <MustInfoContent
          data={[
            {
              ...must,
              ...must?.supplier,
              qty,
            },
          ]}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className="flex gap-8 px-4">Timeline View</div>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <QtyContent data={[{ ...must, qty }]} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <div className="flex gap-8 px-4">Tasks View</div>
      </TabPanel>
    </Box>
  );
}
