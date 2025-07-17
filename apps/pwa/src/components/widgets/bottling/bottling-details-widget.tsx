import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Bottle } from "@/models/types/db";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/base/tabs';
import ResponsibleTeamMemberDataDisplay from "@/components/data-display/responsible-team-member-data-display";
import DocumentsTable from "@/components/table/documents";
import { ROW_HEIGHT_EXPANDED_BOTTLING } from "@/data/constants";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import TabPanel from "../components/tab-panel";
import TasksView from "../components/tasks-view";
import a11yProps from "../utils/a11y-props";
import { formatNumberWithLowerCaseUnitAndSpace } from "@/utils/number-format";

export type BottlingDetailsWidgetProps = {
  bottle: Bottle;
};

export default function BottlingDetailsWidget({
  bottle,
}: BottlingDetailsWidgetProps) {
  const [value, setValue] = useState<number>(0);
  const [localBottle, setLocalBottle] = useState<Bottle>(bottle);
  const [wineQuantity, setWineQuantity] = useState<number>(0);
  //   const mountRef = useRef<boolean>(false);
  //   const { user } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLocalBottle(bottle);
    if (bottle.wines && bottle.wines.length > 0) {
      setWineQuantity(
        bottle.wines.map((wine) => wine.quantity).reduce((a, b) => a + b, 0)
      );
    }
  }, [bottle]);

  const sx = {
    padding: "8px 16px !important",
    minHeight: "fit-content !important",
  };

  //   const setSelected = useSelectedEntitiesStore((state) => state.setSelected);
  //   const open = useDialogDrawerStore(({ open }) => open);
  //   const openDeleteEntityDataDialog = () => open("delete-entity-data");

  //   const handleDeleteClick = (labReport: LabReport) => {
  //     openDeleteEntityDataDialog();
  //     setSelected([labReport as unknown as DashboardEntity], "labReport");
  //   };

  //   const onDeleteLabReport = async (data: any[]) => {
  //     const labReportId = data[0].id;

  //     if (!user?.uid || !bottle.id || !labReportId) return;

  //     const filteredLabData = bottle.labData?.filter(
  //       ({ id }) => id !== labReportId
  //     );

  //     await db.bottle.update(user?.uid, bottle.id, {
  //       labData: filteredLabData,
  //     });
  //   };

  //   const handleDocumentUpload = useCallback(
  //     async (files: Array<{ name: string; url: string }>) => {
  //       if (!user?.uid || !bottle.id || !files) return;

  //       const deletedNames = files
  //         .filter((file) => !file.url)
  //         .map((file) => file.name);

  //       const newDocuments = files
  //         ?.filter((file) => file.url)
  //         ?.map(({ name, url }) => ({
  //           id: crypto.randomUUID(),
  //           name,
  //           fileUrl: url,
  //           owner: { email: user?.email },

  //           uploadDate: Timestamp.now(),
  //         }));

  //       const oldDocuments =
  //         localBottle?.documents?.filter(
  //           (document) => !deletedNames.includes(document.name)
  //         ) || [];

  //       const updatedDocuments = [...newDocuments, ...oldDocuments];

  //       const vineyardRes = await db.bottle.update(user?.uid, bottle.id, {
  //         documents: updatedDocuments,
  //       });

  //       if (vineyardRes.status === 200) {
  //         enqueueSnackbar("Bottle updated successfully", {
  //           variant: "success",
  //         });
  //       } else {
  //         enqueueSnackbar("Error updating bottle", { variant: "error" });
  //       }
  //     },
  //     [user?.email, user?.uid, localBottle, bottle.id]
  //   );

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: ROW_HEIGHT_EXPANDED_BOTTLING,
      }}
      className=""
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          paddingX: 2,
          minWidth: "fit-content",
        }}
      >
        <Tab label="Details" {...a11yProps(0)} sx={sx} />
        <Tab label="Bottle Specs" {...a11yProps(1)} sx={sx} />
        <Tab label="Packaging Details" {...a11yProps(2)} sx={sx} />
        <Tab label="Lab Results" {...a11yProps(3)} sx={sx} />
        <Tab label="Tasks" {...a11yProps(4)} sx={sx} />
        <Tab label="Documents" {...a11yProps(6)} sx={sx} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="flex items-center h-full gap-8 w-full">
          <div className="grid grid-cols-4 gap-4 w-full p-2 justify-between h-full">
            <SimpleDataDisplay
              label="Wine Supply"
              value={
                formatNumberWithLowerCaseUnitAndSpace(wineQuantity, "kg") ||
                "N/A"
              }
            />
            <ResponsibleTeamMemberDataDisplay
              label="Responsible Team Member"
              name={"Fito Segrera"}
              avatar="https://i.pravatar.cc/120"
            />
            <SimpleDataDisplay
              label="Bottling Line"
              value={localBottle?.bottlingLine || "N/A"}
            />
            <SimpleDataDisplay
              label="Losses"
              value={
                formatNumberWithLowerCaseUnitAndSpace(
                  localBottle?.losses,
                  "l"
                ) || "N/A"
              }
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="flex items-center gap-8 w-full h-full">
          <div className="grid grid-cols-4 gap-4 w-full p-2 justify-between h-full">
            <SimpleDataDisplay
              label="Bottle Type"
              value={
                localBottle?.bottleType !== undefined
                  ? localBottle?.bottleType?.toString()
                  : "N/A"
              }
            />
            <SimpleDataDisplay
              label="Bottle Size"
              value={
                localBottle?.bottleSize !== undefined
                  ? formatNumberWithLowerCaseUnitAndSpace(
                      localBottle?.bottleSize,
                      "ml"
                    )
                  : "N/A"
              }
            />
            <SimpleDataDisplay
              label="Label Type"
              value={
                localBottle?.labelType !== undefined
                  ? localBottle?.labelType?.toString()
                  : "N/A"
              }
            />
            <SimpleDataDisplay
              label="Corck Type / Closure"
              value={
                localBottle?.closureType !== undefined
                  ? localBottle?.closureType?.toString()
                  : "N/A"
              }
            />
            <SimpleDataDisplay
              label="Capsule Type"
              value={
                localBottle?.capsuleType !== undefined
                  ? localBottle?.capsuleType?.toString()
                  : "N/A"
              }
            />
            <SimpleDataDisplay
              label="Bottle Weight"
              value={
                localBottle?.bottleWeight !== undefined
                  ? formatNumberWithLowerCaseUnitAndSpace(
                      localBottle?.bottleWeight,
                      "kg"
                    )
                  : "N/A"
              }
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="grid grid-cols-4 gap-4 w-full p-2 justify-between h-full">
          <SimpleDataDisplay
            label="Packaging Type"
            value={
              localBottle?.packagingType !== undefined
                ? localBottle?.packagingType
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Bottles Per Box"
            value={
              localBottle?.bottlesPerBox !== undefined
                ? formatNumberWithLowerCaseUnitAndSpace(
                    localBottle?.bottlesPerBox,
                    "kg"
                  )
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Packaging Material"
            value={
              localBottle?.packagingMaterial !== undefined
                ? localBottle?.packagingMaterial
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Pallet ID"
            value={
              localBottle?.palletId !== undefined
                ? localBottle?.palletId
                : "N/A"
            }
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="grid grid-cols-4 gap-4 w-full p-2 justify-between h-full">
          <SimpleDataDisplay
            label="Alcohol"
            value={
              localBottle?.alcohol !== undefined
                ? localBottle?.alcohol?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Sugar"
            value={
              localBottle?.sugar !== undefined
                ? localBottle?.sugar?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="pH"
            value={
              localBottle?.pH !== undefined
                ? localBottle?.pH?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Total SO2"
            value={
              localBottle?.totalSO2 !== undefined
                ? localBottle?.totalSO2?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Free SO2"
            value={
              localBottle?.freeSO2 !== undefined
                ? localBottle?.freeSO2?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Turbidity"
            value={
              localBottle?.turbidity !== undefined
                ? localBottle?.turbidity?.toString() + " %"
                : "N/A"
            }
          />
          <SimpleDataDisplay
            label="Lab Certificate ID"
            value={
              localBottle?.labCertificateId !== undefined
                ? localBottle?.labCertificateId?.toString() + " %"
                : "N/A"
            }
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <div className="h-full">
          <TasksView tasks={localBottle?.tasks || []} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <div className="flex flex-col max-h-[300px] overflow-hidden">
          <DocumentsTable docs={[]} />
        </div>
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
          {/* <DocumentsTable
            docs={docs}
            uploadedDocuments={localBottle?.documents || []}
            onDocumentUpload={handleDocumentUpload}
          /> */}
        </div>
      </TabPanel>

      {/* <DeleteLabReportDialog onDelete={onDeleteLabReport} /> */}
    </Box>
  );
}
