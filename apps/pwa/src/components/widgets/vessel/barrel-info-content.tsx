import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { BarrelInfo } from "@/models/types/db";

type BarrelInfoProps = {
  data: BarrelInfo;
};

export default function BarrelInfoContent({ data }: BarrelInfoProps) {
  const {
    material,
    toastLevel,
    stavesThickness,
    oxygenTransmissionRate,
    woodGrainDensity,
    manufacturer,
  } = data;

  return (
    <div className="grid grid-cols-3 w-full p-4 py-2">
      <SimpleDataDisplay label="Material" value={material || "N/A"} />
      <SimpleDataDisplay label="Toast level" value={toastLevel || "N/A"} />
      <SimpleDataDisplay
        label="Thickness of Staves"
        value={stavesThickness || "N/A"}
      />
      <SimpleDataDisplay
        label="Oxygen Transmission Rate (OTR)"
        value={oxygenTransmissionRate || "N/A"}
      />
      <SimpleDataDisplay
        label="Wood Grain Density"
        value={woodGrainDensity || "N/A"}
      />
      <SimpleDataDisplay
        label="Vessel manufacturer"
        value={manufacturer || "N/A"}
      />
    </div>
  );
}
