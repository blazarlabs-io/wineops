import { Wine } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import LabDataContent from "./lab-data-content";
import WineInfoContent from "./wine-info-content";
import QtyContent from "./qty-content";
import TasksView from "../components/tasks-view";

type WineDetailsWidgetProps = {
  wine: Wine;
};

export default function WineDetailsWidget({ wine }: WineDetailsWidgetProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const qty = wine?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0);

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
        aria-label="Wine details"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Labs" {...a11yProps(0)} sx={sx} />
        <Tab label="Wine&nbsp;Info" {...a11yProps(1)} sx={sx} />
        <Tab label="Timeline" {...a11yProps(2)} sx={sx} />
        <Tab label="Quantity" {...a11yProps(3)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(4)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LabDataContent labData={wine.labData} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <WineInfoContent
          data={[
            {
              ...wine,
              qty: qty || wine?.qty,
            },
          ]}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className="flex gap-8 px-4">Timeline View</div>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <QtyContent data={[{ ...wine, qty: qty || wine?.qty }]} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <TasksView tasks={wine?.tasks || []} />
      </TabPanel>
    </Box>
  );
}
