import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { StainlessSteelTankInfo } from "@/models/types/db";

type SstInfoProps = {
  data: StainlessSteelTankInfo;
};

export default function SstInfoContent({ data }: SstInfoProps) {
  const {
    materialGrade,
    steelThickness,
    coolingJacketsCoils,
    insulationLayers,
    pressureRating,
  } = data;

  return (
    <div className="grid grid-cols-3 w-full p-4 py-2">
      <SimpleDataDisplay
        label="Material & Grade"
        value={materialGrade || "N/A"}
      />
      <SimpleDataDisplay
        label="Thickness of the Steel"
        value={steelThickness || "N/A"}
      />
      <SimpleDataDisplay
        label="Cooling jackets or coils"
        value={coolingJacketsCoils ? "Yes" : "No"}
      />
      <SimpleDataDisplay
        label="Insulation layers"
        value={insulationLayers ? "Yes" : "No"}
      />
      <SimpleDataDisplay
        label="Pressure Rating"
        value={pressureRating || "N/A"}
      />
    </div>
  );
}
