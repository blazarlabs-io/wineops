import { Bulk } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import LabDataContent from "./lab-data-content";
import BulkInfoContent from "./bulk-info-content";
import QtyContent from "./qty-content";

export type BulkDetailsWidgetProps = {
  bulk: Bulk;
};

export default function BulkDetailsWidget({ bulk }: BulkDetailsWidgetProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const qty = bulk?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0);

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
        aria-label="Bulk details"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Labs" {...a11yProps(0)} sx={sx} />
        <Tab label="Wine&nbsp;Info" {...a11yProps(1)} sx={sx} />
        <Tab label="Timeline" {...a11yProps(2)} sx={sx} />
        <Tab label="Quantity" {...a11yProps(3)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(4)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LabDataContent labData={bulk.labData} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <BulkInfoContent
          data={[
            {
              ...bulk,
              qty: qty || bulk?.qty,
              date: bulk?.startDate,
            },
          ]}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className="flex gap-8 px-4">Timeline View</div>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <QtyContent data={[{ ...bulk, qty: qty || bulk?.qty }]} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <div className="flex gap-8 px-4">Tasks View</div>
      </TabPanel>
    </Box>
  );
}
