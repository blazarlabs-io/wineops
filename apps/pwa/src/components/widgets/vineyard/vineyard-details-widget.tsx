/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as LabResultsChart } from "@/components/charts/lab-results";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { LabReport, Vineyard } from "@/models/types/db";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/base/tabs';
import CadastralDataDisplay from "@/components/data-display/cadastral-data-display";
import LabReportResponsibleDataDisplay from "@/components/data-display/lab-report-responsible-data-display";
import OrientationDataDisplay from "@/components/data-display/orientation-data-display";
import DocumentsTable from "@/components/table/documents";
import PolygonViewerMap from "@/components/widgets/maps/polygon-viewer-map";
import { Add, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import a11yProps from "../utils/a11y-props";
import TabPanel from "../components/tab-panel";
import DeleteLabReportDialog from "@/components/dialogs/delete-lab-report-dialog";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { DashboardEntity } from "@/models/types/dashboard";
import { useDialogDrawerStore } from "@/store/dialogs";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { db as dbClients } from "@/lib/firebase/client";
import { ACTIONS, WINERY } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { enqueueSnackbar } from "notistack";

export type VineyardDetailsWidgetProps = {
  vineyard: Vineyard;
  labReports: LabReport[];
};

export default function VineyardDetailsWidget({
  vineyard,
  labReports,
}: VineyardDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);
  const [localVineyard, setLocalVineyard] = useState<Vineyard>(vineyard);
  const [docs, setDocs] = useState<any[]>([]);
  const mountRef = useRef<boolean>(false);

  const { user } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      if (labReports) {
        labReports.map((l: any) => {
          if (l.supportingDocuments && l.supportingDocuments?.length > 0) {
            console.log("l.supportingDocuments", l);
            l.supportingDocuments.map((d: any) => {
              const newDoc = {
                name: d.name,
                url: d.url,
                responsible: l.responsible,
                date: l.date,
                type: "lab report",
              };
              setDocs((prev) => [...prev, newDoc]);
            });
          }
        });
      }

      if (!user?.uid) return;

      const fetchActions = async () => {
        const filteredActions = (localVineyard?.actions || []).filter(
          ({ name }) => name !== "lab-reports"
        );

        if (filteredActions.length === 0) return;

        const actions = await getActionsByIds(
          filteredActions.map(({ id }) => id),
          user?.uid
        );

        if (actions.length === 0) return;

        const actionDocs: any[] = actions.reduce(
          (
            acc,
            { type, responsible, executionDate, supportingDocuments = [] }
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
          []
        );

        if (actionDocs.length === 0) return;

        setDocs((prev) => [...prev, ...actionDocs]);
      };

      fetchActions();

      setDocs((prev) => [
        ...prev,
        ...(localVineyard?.documents || []).map((doc) => ({
          ...doc,
          url: doc.fileUrl,
          date: doc.uploadDate,
          responsible: doc.owner,
        })),
      ]);
    }
  }, [labReports, user?.uid, localVineyard?.actions, localVineyard?.documents]);

  useEffect(() => {
    setLocalVineyard(vineyard);
  }, [vineyard]);

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };

  const setSelected = useSelectedEntitiesStore((state) => state.setSelected);
  const open = useDialogDrawerStore(({ open }) => open);
  const openDeleteEntityDataDialog = () => open("delete-entity-data");

  const handleDeleteClick = (labReport: LabReport) => {
    openDeleteEntityDataDialog();
    setSelected([labReport as unknown as DashboardEntity], "labReport");
  };

  const onDeleteLabReport = async (data: any[]) => {
    const labReportId = data[0].id;

    if (!user?.uid || !vineyard.id || !labReportId) return;

    const filteredLabData = vineyard.labData?.filter(
      ({ id }) => id !== labReportId
    );

    await db.vineyard.update(user?.uid, vineyard.id, {
      labData: filteredLabData,
    });
  };

  const handleDocumentUpload = useCallback(
    async (files: Array<{ name: string; url: string }>) => {
      if (!user?.uid || !vineyard.id || !files) return;

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
        localVineyard?.documents?.filter(
          (document) => !deletedNames.includes(document.name)
        ) || [];

      const updatedDocuments = [...newDocuments, ...oldDocuments];

      const vineyardRes = await db.vineyard.update(user?.uid, vineyard.id, {
        documents: updatedDocuments,
      });

      if (vineyardRes.status === 200) {
        enqueueSnackbar("Vineyard updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error updating vineyard", { variant: "error" });
      }
    },
    [user?.email, user?.uid, localVineyard?.documents, vineyard.id]
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      className=""
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider", paddingX: 2 }}
      >
        <Tab label="Details" {...a11yProps(0)} sx={sx} />
        <Tab label="Grape&nbsp;Variety" {...a11yProps(1)} sx={sx} />
        <Tab label="Timeline" {...a11yProps(2)} sx={sx} />
        <Tab label="Lab Results" {...a11yProps(3)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(4)} sx={sx} />
        <Tab label="Weather" {...a11yProps(5)} sx={sx} />
        <Tab label="Documents" {...a11yProps(6)} sx={sx} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* * GENERAL INFO */}
        <div className="flex items-center gap-8 w-full">
          <>
            <div className="min-w-[448px]">
              <PolygonViewerMap
                height={"216px"}
                initialCoordinates={
                  localVineyard.info &&
                  localVineyard.info.location &&
                  localVineyard.info?.location.map
                    ? localVineyard.info?.location.map
                    : []
                }
              />
            </div>

            <div className="grid grid-cols-4 gap-8 w-full p-2 justify-between">
              <SimpleDataDisplay
                label="Surface"
                value={
                  localVineyard.info?.location?.surface !== undefined
                    ? localVineyard.info?.location?.surface?.toString() + " Ha"
                    : "N/A"
                }
              />
              <SimpleDataDisplay
                label="Age of Vines"
                value={
                  localVineyard.info.vines.yearOfPlantation
                    ? (
                        new Date().getFullYear() -
                        localVineyard.info?.vines?.yearOfPlantation
                      ).toString() + " years"
                    : "N/A"
                }
              />
              <SimpleDataDisplay
                label="Elevation"
                value={
                  (localVineyard.info?.location?.elevation !== undefined &&
                    localVineyard.info?.location?.elevation?.toString() +
                      " m") ||
                  "N/A"
                }
              />
              <OrientationDataDisplay
                label="Orientation"
                value={
                  localVineyard.info?.location?.orientation
                    ? localVineyard.info?.location?.orientation
                        .split("-")
                        .join(" ")
                    : "N/A"
                }
              />
              <SimpleDataDisplay
                label="Sunlight Hours"
                value={
                  (localVineyard.info?.vines?.sunlightHours !== undefined &&
                    localVineyard.info?.vines?.sunlightHours + " h/year") ||
                  "N/A"
                }
              />
              <SimpleDataDisplay
                label="Soil Type"
                value={localVineyard.info?.vines?.soilType?.toString() || "N/A"}
              />
              <CadastralDataDisplay
                label="Cadastral Number"
                value={localVineyard.cadastralNumber}
              />
              <SimpleDataDisplay
                label="Country"
                value={localVineyard.info?.location?.country || "N/A"}
              />
            </div>
          </>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col w-full gap-2">
            <Typography variant="body1" className="">
              Varietal Classification
            </Typography>
            {localVineyard.grape ? (
              <div
                style={{ border: "1px solid var(--mui-palette-divider)" }}
                className="flex p-1 w-full gap-4 justify-between rounded-md"
              >
                <SimpleDataDisplay
                  label="Country of Origin"
                  value={
                    localVineyard?.grape?.countryOfOrigin?.toString() || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Clonal Selection"
                  value={
                    localVineyard?.grape?.clonalSelection?.toString() || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Grape Color"
                  value={localVineyard?.grapeColor?.toString() || "N/A"}
                  classNames="capitalize"
                />
                <SimpleDataDisplay
                  label="Vivc Number"
                  value={localVineyard?.grape?.vivcNumber?.toString() || "N/A"}
                />
              </div>
            ) : (
              <Paper
                variant="outlined"
                className="flex p-4 w-full gap-4 justify-between rounded-md"
              >
                <Typography variant="body1" color="textDisabled" className="">
                  Grape data unavailable.
                </Typography>
              </Paper>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <Typography variant="body1" className="">
              Planting Scheme
            </Typography>
            {localVineyard.info && (
              <div
                style={{ border: "1px solid var(--mui-palette-divider)" }}
                className="flex p-1 w-full gap-4 justify-between rounded-md"
              >
                <SimpleDataDisplay
                  label="Spacing"
                  value={
                    (localVineyard.info?.vines?.plantingScheme?.spacing !==
                      undefined &&
                      localVineyard.info?.vines?.plantingScheme?.spacing?.toString() +
                        " m") ||
                    "N/A"
                  }
                />
                <OrientationDataDisplay
                  label="Row Orientation"
                  value={
                    localVineyard.info?.vines?.plantingScheme?.rowOrientation
                      ?.toString()
                      .split("-")
                      .join(" ") || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Density"
                  value={
                    localVineyard.info?.vines?.plantingScheme?.density?.toString() +
                      " m" || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Trellis System"
                  value={
                    localVineyard.info?.vines?.plantingScheme?.trellisSystem?.toString() ||
                    "N/A"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="flex gap-8 px-4">Timeline View</div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        {labReports && labReports.length > 0 && (
          <Stack display={"flex"} direction={"column"} gap={0}>
            <div className="flex items-center justify-start gap-4 w-full">
              <Button
                size="small"
                variant="text"
                className="capitalize!"
                startIcon={<Add />}
              >
                New Report
              </Button>
              <div
                className="w-[1px] h-[24px]"
                style={{ background: "var(--mui-palette-divider)" }}
              />
              <Button size="small" variant="text" className="capitalize!">
                View All
              </Button>
            </div>
            <div className="flex items-center gap-4 w-full overflow-x-auto">
              <div className="min-w-fit h-full flex flex-col max-w-[200px] max-h-[180px] gap-2 overflow-y-scroll pr-4">
                {labReports.map((item, index) => {
                  return (
                    <div
                      key={item.id + index}
                      className="min-w-fit rounded-md w-full"
                      style={{
                        border: "1px solid var(--mui-palette-divider)",
                      }}
                    >
                      {/* {index < 3 && ( */}
                      <div className="flex items-center min-w-fit w-full gap-1 px-2 py-1 h-full ">
                        <LabReportResponsibleDataDisplay
                          data={item}
                          prevData={
                            index < labReports?.length - 1
                              ? labReports[index + 1]
                              : undefined
                          }
                        />
                        <IconButton
                          size="small"
                          className="max-w-[24px] max-h-[24px]"
                          color="error"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <DeleteOutline className="max-w-4 max-h-4" />
                        </IconButton>
                      </div>
                      {/* )} */}
                    </div>
                  );
                })}
              </div>
              <div
                className="min-w-[600px] w-full flex items-center justify-start"
                style={{ height: "220px" }}
              >
                <LabResultsChart
                  data={{
                    id: "1",
                    items: labReports,
                    date: new Date().toISOString(),
                  }}
                />
              </div>
            </div>
          </Stack>
        )}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography>Tasks</Typography>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Typography>Weather</Typography>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          {/* <div className="flex items-center justify-start w-full">
            <Button variant="text" className="">
              Upload
            </Button>
            <Button variant="text" className="">
              View All
            </Button>
          </div> */}
          <DocumentsTable
            docs={docs}
            uploadedDocuments={localVineyard?.documents || []}
            onDocumentUpload={handleDocumentUpload}
          />
        </div>
      </TabPanel>

      <DeleteLabReportDialog onDelete={onDeleteLabReport} />
    </Box>
  );
}

async function getActionsByIds(
  actionIds: string[],
  uid: string
): Promise<any[]> {
  if (actionIds.length === 0) return [];

  const chunks = chunkArray(actionIds, 10);

  const queries = chunks.map((idChunk) => {
    const actionsRef = collection(dbClients, WINERY, uid, ACTIONS);
    return query(actionsRef, where("__name__", "in", idChunk));
  });

  const results = await Promise.all(queries.map((q) => getDocs(q)));

  const actions = results.flatMap((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  );

  return actions;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
