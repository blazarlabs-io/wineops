/* eslint-disable @typescript-eslint/no-explicit-any */
import LabResultsChart from "@/components/charts/lab-results-chart";
import LabReportResponsibleDataDisplay from "@/components/data-display/lab-report-responsible-data-display";
import DeleteLabReportDialog from "@/components/dialogs/delete-lab-report-dialog";
import LabResultsDialog from "@/components/dialogs/lab-results-dialog";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { LabReport, Must, Vineyard } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedItemsStore } from "@/store/selected-items";
import { Add, DeleteOutline } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

type LabResultsContentProps = {
  entity: Vineyard | Must;
  labReports: LabReport[];
  onNewReport?: () => void;
  showDetails?: boolean;
};

export default function LabResultsContent({
  entity,
  labReports,
  onNewReport,
  showDetails = false,
}: LabResultsContentProps) {
  const { user } = useAuth();

  const isMust = "labDataReports" in entity;

  const setSelectedItem = useSelectedItemsStore(
    (state) => state.setSelectedItems,
  );

  const open = useDialogDrawerStore(({ open }) => open);

  const handleDeleteClick = (labReport: LabReport) => {
    open("delete-entity-data");
    setSelectedItem([labReport], "labReport");
  };

  const onDeleteLabReport = async (data: any[]) => {
    const labReportId = data[0].id;

    if (!user?.uid || !entity.id || !labReportId) return;

    const filteredLabData = (
      isMust ? entity?.labDataReports : (entity as Vineyard).labData
    )?.filter(({ id }) => id !== labReportId);

    await db.vineyard.update(user?.uid, entity.id, {
      labData: filteredLabData,
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [labReportId, setLabReportId] = useState("");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = (id: string) => {
    if (!id) return;

    setLabReportId(id);
    setIsOpen(true);
  };

  const labResults = labReports.find(({ id = "" }) => id === labReportId);

  const cardContent = (item: LabReport, index: number) => (
    <div className="flex items-center min-w-fit w-full gap-1 px-2 py-1 h-full ">
      <LabReportResponsibleDataDisplay
        data={item}
        prevData={
          index < labReports?.length - 1 ? labReports[index + 1] : undefined
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
  );

  return (
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
          disabled={!onNewReport}
          onClick={onNewReport}
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
        <div className="min-w-fit h-full flex flex-col max-h-[180px] gap-2 overflow-y-auto pr-4">
          {[
            ...labReports.sort(
              (a, b) =>
                (b.date as Timestamp).toDate().getTime() -
                (a.date as Timestamp).toDate().getTime(),
            ),
          ]?.map((item, index) => {
            return (
              <Card
                key={item?.id + index}
                className="min-w-fit rounded-md w-full"
                style={{
                  border: "1px solid var(--mui-palette-divider)",
                }}
              >
                {showDetails ? (
                  <CardActionArea
                    component="div"
                    sx={{ height: "100%" }}
                    onClick={() => handleOpen(item?.id || "")}
                  >
                    <CardContent sx={{ p: 0, height: "100%" }}>
                      {cardContent(item, index)}
                    </CardContent>
                  </CardActionArea>
                ) : (
                  cardContent(item, index)
                )}
              </Card>
            );
          })}
        </div>
        <div
          className="min-w-[600px] w-full flex items-center1 justify-start"
          style={{ height: "180px" }}
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

      <LabResultsDialog open={isOpen} data={labResults} onClose={handleClose} />

      <DeleteLabReportDialog onDelete={onDeleteLabReport} />
    </Stack>
  );
}
