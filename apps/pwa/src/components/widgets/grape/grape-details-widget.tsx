
import { Grape, LabReport } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import GrapeEntryContent from "./grape-entry-content";
import SupplierContent from "./supplier-content";
import LabDataContent from "./lab-data-content";
import DocumentsTable from "@/components/table/documents";
import TasksView from "../components/tasks-view";

type GrapeDetailsWidgetProps = {
  grape: Grape;
  labReports: LabReport[];
};

export default function GrapeDetailsWidget({
  grape,
  labReports,
}: GrapeDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);
  const [docs, setDocs] = useState<any[]>([]);
  const mountRef = useRef<boolean>(false);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };

  useEffect(() => {
    if (labReports && !mountRef.current) {
      mountRef.current = true;
      labReports.map((l: any) => {
        if (l.supportingDocuments && l.supportingDocuments?.length > 0) {
          l.supportingDocuments.map((d: any) => {
            const newDoc = {
              name: d.name,
              url: d.url,
              responsible: l.responsible,
              date: l.date,
            };
            setDocs((prev) => [...prev, newDoc]);
          });
        }
      });
    }
  }, [labReports]);

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
        <TasksView tasks={grape?.tasks || []} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          <DocumentsTable docs={docs} />
        </div>
      </TabPanel>
    </Box>
  );
}
