/* eslint-disable @typescript-eslint/no-explicit-any */
import { Must, MustLabData, StorageCondition } from "@/models/types/db";
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
import DocumentsTable from "@/components/table/documents";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { getActionsByIds } from "../utils/get-actions-by-ids";
import { enqueueSnackbar } from "notistack";
import { Timestamp } from "firebase/firestore";
import StorageConditionsContent from "./storage-conditions-content";
import LabsContent from "./labs-content";
import TasksView from "../components/tasks-view";

type StorageDetailsWidgetProps = {
  must: Must;
};

export default function StorageDetailsWidget({
  must,
}: StorageDetailsWidgetProps) {
  const [value, setValue] = useState(0);
  const [localMust, setLocalMust] = useState<Must>(must);
  const [docs, setDocs] = useState<any[]>([]);
  const mountRef = useRef<boolean>(false);

  const [storageConditions, setStorageConditions] = useState<
    StorageCondition[]
  >([]);

  const [labsData, setLabsData] = useState<MustLabData[]>([]);

  const { user } = useAuth();

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      if (!user?.uid) return;

      const fetchActions = async () => {
        const filteredActions = (localMust?.actions || []).filter(
          ({ name }) => name,
        );

        if (filteredActions.length === 0) return;

        const actions = await getActionsByIds(
          filteredActions.map(({ id }) => id),
          user?.uid,
        );

        if (actions.length === 0) return;

        const storageConditions = (actions.filter(
          ({ type }) => type === "add-storage-condition",
        ) || []) as StorageCondition[];

        setStorageConditions(storageConditions);

        const labsData = (actions.filter(({ type }) => type === "lab-report") ||
          []) as MustLabData[];

        setLabsData(labsData);

        const actionDocs: any[] = actions.reduce(
          (
            acc,
            { type, responsible, executionDate, supportingDocuments = [] },
          ) => [
            ...acc,
            ...supportingDocuments.map((doc: any) => ({
              name: doc.name,
              url: doc.url,
              responsible,
              date: executionDate,
              type: type.split("-").join(" "),
            })),
          ],
          [],
        );

        if (actionDocs.length === 0) return;

        setDocs((prev) => [...prev, ...actionDocs]);
      };

      fetchActions();

      setDocs((prev) => [
        ...prev,
        ...(localMust?.documents || []).map((doc) => ({
          ...doc,
          url: doc.fileUrl,
          date: doc.uploadDate,
          responsible: doc.owner,
        })),
      ]);
    }
  }, [user?.uid, localMust?.actions, localMust?.documents]);

  useEffect(() => {
    setLocalMust(must);
  }, [must]);

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };

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
        localMust?.documents?.filter(
          (document) => !deletedNames.includes(document.name),
        ) || [];

      const updatedDocuments = [...newDocuments, ...oldDocuments];

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
    [user?.email, user?.uid, localMust?.documents, must.id],
  );

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
        aria-label="Storage details"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Storage Conditions" {...a11yProps(0)} sx={sx} />
        <Tab label="Labs" {...a11yProps(1)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(2)} sx={sx} />
        <Tab label="Timeline" {...a11yProps(3)} sx={sx} />
        <Tab label="Documents" {...a11yProps(4)} sx={sx} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <StorageConditionsContent data={storageConditions} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <LabsContent data={labsData} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TasksView tasks={must?.tasks || []} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <div className="flex gap-8 px-4">Timeline View</div>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          <DocumentsTable docs={docs} onDocumentUpload={handleDocumentUpload} />
        </div>
      </TabPanel>
    </Box>
  );
}
