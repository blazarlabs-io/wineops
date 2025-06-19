import LabItem from "@/components/data-display/lab-item";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import UnitDisplay from "@/components/data-display/unit-display";
import { DEFAULT_LOCALE } from "@/data/constants";
import { MustLabData } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";

type LabDataProps = {
  labData?: MustLabData;
};

export default function LabDataContent({ labData }: LabDataProps) {
  const {
    date,
    sugar,
    acidity,
    alcohol,
    temperature,
    volatileAcidity,
    yeastActivityPopulation,
    yeastAssimilableNitrogen,
    labCertificateID,
    labTechnicianName,
  } = labData ?? {};

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "flex-end", lineHeight: 1 }}>
        <Link href="" className="underline">
          Attach a document
        </Link>
      </Stack>

      <div className="grid grid-cols-5 w-full py-2 items-center justify-center">
        <SimpleDataDisplay
          label="Date"
          value={date ? formatDate(date, { locale: DEFAULT_LOCALE }) : "N/A"}
        />

        <SimpleDataDisplay
          label="Temperature"
          value={
            temperature?.value ? (
              <div className="flex items-start gap-1">
                <span className="text-muted-foreground">
                  {temperature.value}
                </span>
                <UnitDisplay unit={temperature.unit ?? ""} />
              </div>
            ) : (
              "N/A"
            )
          }
        />

        <Box p={1.5}>
          <LabItem label="Alcohol" data={alcohol} />
        </Box>

        <Box p={1.5}>
          <LabItem label="Sugar" data={sugar} />
        </Box>

        <Box p={1.5}>
          <LabItem label="Acidity" data={acidity} />
        </Box>

        <SimpleDataDisplay
          label="Volatile Acidity"
          value={
            volatileAcidity?.value ? (
              <div className="flex items-start gap-1">
                <span className="text-muted-foreground">
                  {volatileAcidity.value}
                </span>
                <UnitDisplay unit={volatileAcidity.unit ?? ""} />
              </div>
            ) : (
              "N/A"
            )
          }
        />

        <SimpleDataDisplay
          label="Yeast Activity / Population "
          value={
            yeastActivityPopulation?.value ? (
              <div className="flex items-start gap-1">
                <span className="text-muted-foreground">
                  {yeastActivityPopulation.value}
                </span>
                <UnitDisplay unit={yeastActivityPopulation.unit ?? ""} />
              </div>
            ) : (
              "N/A"
            )
          }
        />

        <SimpleDataDisplay
          label="Yeast Assimilable Nitrogen  "
          value={
            yeastAssimilableNitrogen?.value ? (
              <div className="flex items-start gap-1">
                <span className="text-muted-foreground">
                  {yeastAssimilableNitrogen.value}
                </span>
                <UnitDisplay unit={yeastAssimilableNitrogen.unit ?? ""} />
              </div>
            ) : (
              "N/A"
            )
          }
        />

        <SimpleDataDisplay
          label="Lab technician name"
          value={labTechnicianName ?? "N/A"}
        />

        <SimpleDataDisplay
          label="Lab Certificate ID"
          value={labCertificateID ?? "N/A"}
        />
      </div>
    </Stack>
  );
}
