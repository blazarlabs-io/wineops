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
import { Add } from "@mui/icons-material";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useRef, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className="w-full h-full"
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (labReports && !mountRef.current) {
      mountRef.current = true;
      labReports.map((l: any) => {
        if (l.supportingDocuments && l.supportingDocuments?.length > 0) {
          console.log("l.supportingDocuments", l);
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

  useEffect(() => {
    setLocalVineyard(vineyard);
  }, [vineyard]);

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
        <Tab label="Lab Results" {...a11yProps(2)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(3)} sx={sx} />
        <Tab label="Weather" {...a11yProps(4)} sx={sx} />
        <Tab label="Documents" {...a11yProps(5)} sx={sx} />
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
                value={localVineyard.cadastralNumber || "N/A"}
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
                      <div className="flex items-center min-w-fit max-w-fit gap-8 px-2 py-1 h-full ">
                        <LabReportResponsibleDataDisplay data={item} />
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
      <TabPanel value={value} index={3}>
        <Typography>Tasks</Typography>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography>Weather</Typography>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          {/* <div className="flex items-center justify-start w-full">
            <Button variant="text" className="">
              Upload
            </Button>
            <Button variant="text" className="">
              View All
            </Button>
          </div> */}
          <DocumentsTable docs={docs} />
        </div>
      </TabPanel>
    </Box>
  );
}
