import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Chemistry } from "@/models/types/db";

type GeneralInfoProps = {
  data: Partial<Chemistry>;
};

export default function GeneralInfoContent({ data }: GeneralInfoProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-5 w-full">
      <SimpleDataDisplay
        label="Used stage of production"
        value={data?.stageOfProduction || "N/A"}
      />
      <SimpleDataDisplay
        label="Recomended dosage"
        value={data?.recommendedDosage || "N/A"}
      />
      <SimpleDataDisplay
        label="Maximum admisible Dosage"
        value={data?.maxDosage || "N/A"}
      />
      <SimpleDataDisplay
        label="Legal/Use Notes"
        value={data?.legalUseNotes || "N/A"}
      />
      <SimpleDataDisplay label="Comments" value={data?.comments || "N/A"} />
    </div>
  );
}
