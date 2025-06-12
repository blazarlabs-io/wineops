import { Grape } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import GrapeEntryContent from "./grape-entry-content";
import SupplierContent from "./supplier-content";
import DocumentsContent from "./documents-content";
import LabDataContent from "./lab-data-content";

export type GrapeDetailsWidgetProps = {
  grape: Grape;
};

export default function GrapeDetailsWidget({ grape }: GrapeDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
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
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Grape details"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Grape&nbsp;Entry" {...a11yProps(0)} sx={sx} />
        <Tab label="Supplier" {...a11yProps(1)} sx={sx} />
        <Tab label="Lab Data" {...a11yProps(2)} sx={sx} />
        <Tab label="Task" {...a11yProps(3)} sx={sx} />
        <Tab label="Documents" {...a11yProps(4)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <GrapeEntryContent
          entry={grape?.entry ?? {}}
          processingInfo={grape.processingInfo ?? {}}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SupplierContent
          supplier={grape.supplier ?? {}}
          transportationInfo={grape.transportationInfo ?? {}}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <LabDataContent labData={grape.labData ?? {}} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <div className="flex gap-8 px-4">Task View</div>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <DocumentsContent documents={grape.documents} />
      </TabPanel>
    </Box>
  );
}
