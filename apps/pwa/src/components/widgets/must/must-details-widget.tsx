import { Must } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { SyntheticEvent, useCallback, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import MustInfoContent from "./must-info-content";
import QtyContent from "./qty-content";
import TasksView from "../components/tasks-view";
import { useVineyard } from "@/context/vineyard";
import { useGetLabData } from "@/hooks/use-get-lab-data";
import LabResultsContent from "../components/lab-results-content";
import { useDialogDrawerStore } from "@/store/dialogs";
import { ActionsEntity, MustActionType } from "@/models/types/actions";
import { useMust } from "@/context/must";

type MustDetailsWidgetProps = {
  must: Must;
};

export default function MustDetailsWidget({ must }: MustDetailsWidgetProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const qty = must?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0);

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };
  const { actions } = useMust();
  const { labReports } = useVineyard();

  const open = useDialogDrawerStore(({ open }) => open);

  const handleNewReport = useCallback(() => {
    if (!actions["lab-report" as MustActionType]) return;

    open("action-drawer", "lab-report" as unknown as ActionsEntity, must);
  }, [open, must, actions]);

  const { labData } = useGetLabData(must?.labDataReports || [], labReports);

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
        aria-label="Must details"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Lab&nbsp;Results" {...a11yProps(0)} sx={sx} />
        <Tab label="Must&nbsp;Info" {...a11yProps(1)} sx={sx} />
        <Tab label="Timeline" {...a11yProps(2)} sx={sx} />
        <Tab label="Quantity" {...a11yProps(3)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(4)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LabResultsContent
          showDetails
          entity={must}
          labReports={labData || []}
          onNewReport={
            actions["lab-report" as MustActionType]
              ? handleNewReport
              : undefined
          }
        />
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
        <TasksView tasks={must?.tasks || []} />
      </TabPanel>
    </Box>
  );
}
