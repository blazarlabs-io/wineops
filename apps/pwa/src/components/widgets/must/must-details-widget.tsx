/* eslint-disable @typescript-eslint/no-explicit-any */
import { Must } from "@/models/types/db";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import DocumentsTable from "@/components/table/documents";
import { useAuth } from "@/lib/firebase/auth";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/services";
import { enqueueSnackbar } from "notistack";
import { getActionsByIds } from "../utils/get-actions-by-ids";

type MustDetailsWidgetProps = {
  must: Must;
};

export default function MustDetailsWidget({ must }: MustDetailsWidgetProps) {
  const [value, setValue] = useState(0);
  const [docs, setDocs] = useState<any[] | undefined>();
  const mountRef = useRef<boolean>(false);

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

  const { user } = useAuth();

  const handleDocumentUpload = useCallback(
    async (files: Array<{ name: string; url: string }>) => {
      if (!user?.uid || !must.id || !files) return;

      const deletedNames = files
        .filter((file) => !file.url)
        .map((file) => file.name);

      const newDocuments = files
        ?.filter((file) => file.url)
        ?.map(({ name, url }) => ({
          id: crypto.randomUUID(),
          name,
          fileUrl: url,
          owner: { email: user?.email },

          uploadDate: Timestamp.now(),
        }));

      const oldDocuments =
        must?.documents?.filter(
          (document) => !deletedNames.includes(document.name),
        ) || [];

      const filteredNewDocuments = newDocuments?.filter(
        (document) =>
          !oldDocuments.map((file) => file.name).includes(document.name),
      );

      const updatedDocuments = [...oldDocuments, ...filteredNewDocuments];

      const mustRes = await db.must.update(user?.uid, must.id, {
        documents: updatedDocuments,
      });

      if (mustRes.status === 200) {
        enqueueSnackbar("Must updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error updating must", { variant: "error" });
      }
    },
    [user?.email, user?.uid, must?.documents, must.id],
  );

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      if (!user?.uid) return;

      const fetchActions = async () => {
        if (!must?.actions || must?.actions?.length === 0) return;

        const actions = await getActionsByIds(
          must.actions.map(({ id }) => id),
          user?.uid,
        );

        if (actions.length === 0) return;

        const actionDocs: any[] = actions.reduce(
          (
            acc,
            { id, type, responsible, executionDate, supportingDocuments = [] },
          ) => [
            ...acc,
            ...supportingDocuments.map((doc: any) => ({
              name: doc.name,
              url: doc.url,
              responsible,
              date: executionDate,
              type: type.split("-").join(" "),
              actionId: id,
              mustId: must.id,
              actions: must?.actions,
            })),
          ],
          [],
        );

        if (actionDocs.length === 0) return;

        setDocs((prev = []) => [...prev, ...actionDocs]);
      };

      fetchActions();

      setDocs((prev = []) => [
        ...prev,
        ...(must?.documents || []).map((doc) => ({
          ...doc,
          url: doc.fileUrl,
          date: doc.uploadDate,
          responsible: doc.owner,
          mustId: must.id,
        })),
      ]);
    }
  }, [must.actions, must?.documents, must.id, user?.uid]);

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
        <Tab label="Documents" {...a11yProps(5)} sx={sx} />
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
      <TabPanel value={value} index={5}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          <DocumentsTable docs={docs} onDocumentUpload={handleDocumentUpload} />
        </div>
      </TabPanel>
    </Box>
  );
}
