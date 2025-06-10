import { default as LabResultsChart } from "@/components/charts/lab-results";
import LabSingleItemDataDisplay from "@/components/data-display/lab-single-item-data-display";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import DocumentsSimpleTable from "@/components/table/documents-simple";
import { convertIsoToShortDate } from "@/helpers/date-helpers";
import { LabReport, Vineyard } from "@/models/types/db";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/base/tabs';
import Link from "next/link";
import PolygonViewerMap from "@/components/widgets/maps/polygon-viewer-map";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LabReportSimpleDataDisplay from "@/components/data-display/lab-report-simple-data-display";

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log("vineyard", vineyard);
    setLocalVineyard(vineyard);
  }, [vineyard]);

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
        <Tab
          label="details"
          {...a11yProps(0)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
        <Tab
          label="grapeVariety"
          {...a11yProps(1)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
        <Tab
          label="Lab Results"
          {...a11yProps(2)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
        <Tab
          label="Tasks"
          {...a11yProps(3)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
        <Tab
          label="Weather"
          {...a11yProps(4)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
        <Tab
          label="Documents"
          {...a11yProps(5)}
          sx={{
            padding: "8px !important",
            minHeight: "fit-content !important",
          }}
        />
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
                  localVineyard.info?.location?.surface?.toString() + " Ha" ||
                  "N/A"
                }
              />
              <SimpleDataDisplay
                label="Age of Vines"
                value={
                  localVineyard.info.vines.yearOfPlantation
                    ? (
                        new Date().getFullYear() -
                        localVineyard.info?.vines?.yearOfPlantation
                      ).toString()
                    : "N/A"
                }
              />
              <SimpleDataDisplay
                label="Elevation"
                value={
                  localVineyard.info?.location?.elevation?.toString() + " m" ||
                  "N/A"
                }
              />
              <SimpleDataDisplay
                label="Orientation"
                value={localVineyard.info?.location?.orientation || "N/A"}
              />
              <SimpleDataDisplay
                label="Sunlight Hours"
                value={localVineyard.info?.vines?.sunlightHours || "N/A"}
              />
              <SimpleDataDisplay
                label="Soil Type"
                value={localVineyard.info?.vines?.soilType?.toString() || "N/A"}
              />
              <SimpleDataDisplay
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
                className="flex p-4 w-full gap-4 justify-between rounded-md"
              >
                <SimpleDataDisplay
                  label="Clonal Selection"
                  value={
                    localVineyard?.grape?.clonalSelection?.toString() || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Vivc Number"
                  value={localVineyard?.grape?.vivcNumber?.toString() || "N/A"}
                />
                <SimpleDataDisplay
                  label="Country of Origin"
                  value={
                    localVineyard?.grape?.countryOfOrigin?.toString() || "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Grape Color"
                  value={localVineyard?.grapeColor?.toString() || "N/A"}
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
                className="flex p-4 w-full gap-4 justify-between rounded-md"
              >
                <SimpleDataDisplay
                  label="Spacing"
                  value={
                    localVineyard.info.vines.plantingScheme.spacing.toString() ||
                    "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Row Orientation"
                  value={
                    localVineyard.info.vines.plantingScheme.rowOrientation.toString() ||
                    "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Density"
                  value={
                    localVineyard.info.vines.plantingScheme.density.toString() ||
                    "N/A"
                  }
                />
                <SimpleDataDisplay
                  label="Trellis System"
                  value={
                    localVineyard.info.vines?.plantingScheme?.trellisSystem
                      ? "Yes"
                      : "No"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {labReports && labReports.length > 0 && (
          <div className="flex w-full items-center gap-4">
            <div className="w-fit h-full flex flex-wrap max-w-[264px] max-h-[268px] gap-2 overflow-y-scroll pr-4">
              {labReports.map((item, index) => {
                return (
                  <div
                    key={item.id + index}
                    className="w-full rounded-md"
                    style={{
                      border: "1px solid var(--mui-palette-divider)",
                    }}
                  >
                    {/* {index < 3 && ( */}
                    <div className="flex items-center w-full justify-between gap-8 px-4 py-3 h-full ">
                      <LabReportSimpleDataDisplay data={item} />
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
        )}
        <div className="absolute -top-2 right-12 z-10">
          <Link href="" className="underline">
            View All
          </Link>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Tasks</Typography>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography>Weather</Typography>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <div className="flex gap-8 px-4 relative">
          <div className="absolute -top-6 right-4 z-10">
            <Link href="" className="underline">
              View All
            </Link>
          </div>
          <DocumentsSimpleTable data={localVineyard.documents} />
        </div>
      </TabPanel>
    </Box>
  );
}
