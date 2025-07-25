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
import { useDialogDrawerStore } from "@/store/dialogs";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { Timestamp } from "firebase/firestore";
import { enqueueSnackbar } from "notistack";
import { getActionsByIds } from "./utils";
import { ActionsEntity } from "@/models/types/actions";
import { useSelectedItemsStore } from "@/store/selected-items";
import TasksView from "../components/tasks-view";

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
  const [docs, setDocs] = useState<any[] | undefined>();
  const mountRef = useRef<boolean>(false);

  const { user } = useAuth();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      if (!user?.uid) return;

      const fetchActions = async () => {
        if (!localVineyard?.actions || localVineyard?.actions?.length === 0)
          return;

        const actions = await getActionsByIds(
          localVineyard.actions.map(({ id }) => id),
          user?.uid
        );

        if (actions.length === 0) return;

        const actionDocs: any[] = actions.reduce(
          (
            acc,
            { id, type, responsible, executionDate, supportingDocuments = [] }
          ) => [
            ...acc,
            ...supportingDocuments.map((doc: any) => ({
              name: doc.name,
              url: doc.url,
              responsible,
              date: executionDate,
              type: type.split("-").join(" "),
              actionId: id,
              vineyardId: localVineyard.id,
              actions: localVineyard?.actions,
            })),
          ],
          []
        );

        if (actionDocs.length === 0) return;

        setDocs((prev = []) => [...prev, ...actionDocs]);
      };

      fetchActions();

      setDocs((prev = []) => [
        ...prev,
        ...(localVineyard?.documents || []).map((doc) => ({
          ...doc,
          url: doc.fileUrl,
          date: doc.uploadDate,
          responsible: doc.owner,
          vineyardId: localVineyard.id,
        })),
      ]);
    }
  }, [
    localVineyard.actions,
    localVineyard?.documents,
    localVineyard.id,
    user?.uid,
  ]);

  useEffect(() => {
    setLocalVineyard(vineyard);
  }, [vineyard]);

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };

  const setSelectedItem = useSelectedItemsStore(
    (state) => state.setSelectedItems
  );
  const open = useDialogDrawerStore(({ open }) => open);
  const openDeleteEntityDataDialog = () => open("delete-entity-data");

  const handleDeleteClick = (labReport: LabReport) => {
    openDeleteEntityDataDialog();
    setSelectedItem([labReport], "labReport");
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

      const filteredNewDocuments = newDocuments?.filter(
        (document) =>
          !oldDocuments.map((file) => file.name).includes(document.name)
      );

      const updatedDocuments = [...oldDocuments, ...filteredNewDocuments];

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

  const openLabReportAction = useCallback(
    () =>
      open(
        "action-drawer",
        "lab-report" as unknown as ActionsEntity,
        localVineyard
      ),
    [localVineyard, open]
  );

  const handleNewReport = useCallback(() => {
    openLabReportAction();
  }, [openLabReportAction]);

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

            <div className="grid grid-cols-4 gap-4 w-full p-2 justify-between">
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

              <CadastralDataDisplay
                label="Identificatorul unic al parcelei viticole"
                value={localVineyard.identificatorUnicParcela || []}
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
        <Stack
          gap={1}
          sx={{
            height: "100%",
          }}
        >
          <div className="flex items-center justify-start gap-4 w-full">
            <Button
              size="small"
              variant="text"
              className="capitalize!"
              startIcon={<Add />}
              onClick={handleNewReport}
            >
              New Report
            </Button>
            <div
              className="w-[1px] h-[24px]"
              style={{ background: "var(--mui-palette-divider)" }}
            />
            <Button
              size="small"
              variant="text"
              className="capitalize!"
              disabled={labReports?.length === 0}
            >
              View All
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full overflow-x-auto">
            <div className="min-w-fit h-full flex flex-col max-w-[200px] max-h-[180px] gap-2 overflow-y-scroll pr-4">
              {[
                ...labReports.sort(
                  (a, b) =>
                    (b.date as Timestamp).toDate().getTime() -
                    (a.date as Timestamp).toDate().getTime()
                ),
              ]?.map((item, index) => {
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
      </TabPanel>
      <TabPanel value={value} index={4}>
        <TasksView tasks={vineyard?.tasks || []} />
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
          <DocumentsTable docs={docs} onDocumentUpload={handleDocumentUpload} />
        </div>
      </TabPanel>

      <DeleteLabReportDialog onDelete={onDeleteLabReport} />
    </Box>
  );
}
