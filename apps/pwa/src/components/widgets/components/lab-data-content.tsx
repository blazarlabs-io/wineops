import LabItem from "@/components/data-display/lab-item";
import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import UnitDisplay from "@/components/data-display/unit-display";
import { DEFAULT_LOCALE } from "@/data/constants";
import { LabReport } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Box from "@mui/material/Box";

type LabDataProps = {
  labData?: LabReport;
};

export default function LabDataContent({ labData }: LabDataProps) {
  const { date } = labData ?? {};
  const {
    sugar,
    acidity,
    alcohol,
    temperature,
    volatileAcidity,
    yeastActivityPopulation,
    yeastAssimilableNitrogen,
  } = labData?.results ?? {};

  return (
    <div className="grid grid-cols-5 w-full py-2 items-start">
      <SimpleDataDisplay
        classNames="min-w-[100px] w-[100px] gap-1.5"
        label="Date"
        value={date ? formatDate(date, { locale: DEFAULT_LOCALE }) : "N/A"}
      />

      <SimpleDataDisplay
        classNames="min-w-[100px] w-[100px] gap-1.5"
        label="Temperature"
        value={
          temperature?.value ? (
            <div className="flex items-start gap-1">
              <span className="text-muted-foreground">{temperature.value}</span>
              <UnitDisplay unit={temperature.unit ?? ""} />
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <Box p={1} sx={{ paddingTop: 1.5, paddingBottom: 0 }}>
        <LabItem
          label="Alcohol"
          data={{ ...alcohol, unit: alcohol?.unit || "%" }}
        />
      </Box>

      <Box p={1.5}>
        <LabItem
          label="Sugar"
          data={{ ...sugar, unit: sugar?.unit || "g/dm³" }}
        />
      </Box>

      <Box p={1.5}>
        <LabItem
          label="Acidity"
          data={{ ...acidity, unit: acidity?.unit || "g/dm³" }}
        />
      </Box>

      <SimpleDataDisplay
        classNames="min-w-[100px] w-[100px] h-full justify-between"
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
        classNames="min-w-[100px] w-[100px] h-full justify-between"
        label="Yeast Activity / Population"
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
        classNames="min-w-[100px] w-[100px] h-full justify-between"
        label="Yeast Assimilable Nitrogen"
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
        classNames="min-w-[100px] w-[100px] h-full justify-between"
        label="Lab technician name"
        value={"N/A"}
      />

      <SimpleDataDisplay
        classNames="min-w-[100px] w-[100px] h-full justify-between"
        label="Lab Certificate ID"
        value={"N/A"}
      />
    </div>
  );
}
