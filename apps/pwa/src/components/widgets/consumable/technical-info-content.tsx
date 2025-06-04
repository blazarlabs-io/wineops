import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { DEFAULT_LOCALE } from "@/data/constants";
import { Consumable } from "@/models/types/db";
import formatDate, { parseToDate } from "@/utils/date-format";

type TechnicalInfoProps = {
  data: Partial<Consumable>;
};

export default function TechnicalInfoContent({ data }: TechnicalInfoProps) {
  if (!data) return null;

  const shelfLife =
    data?.expiryDate && parseToDate(data?.expiryDate)
      ? (parseToDate(data.expiryDate)?.getFullYear() || 0) -
        new Date().getFullYear()
      : "";

  return (
    <div className="grid grid-cols-5 w-full">
      <SimpleDataDisplay
        label="Specifications"
        value={data.specifications || "N/A"}
      />
      <SimpleDataDisplay
        label="Storage/Handling Notes"
        value={data.storageHandlingNotes || "N/A"}
      />
      <SimpleDataDisplay
        label="Shelf Life/Expiry Date"
        value={
          <>
            {shelfLife && shelfLife > 0
              ? `${shelfLife} ${shelfLife === 1 ? "year" : "years"} / `
              : ""}
            {data?.expiryDate
              ? formatDate(data.expiryDate, { locale: DEFAULT_LOCALE })
              : "N/A"}
          </>
        }
      />
      <SimpleDataDisplay
        label="Organic/Biodynamic Status"
        value={data.organicBiodynamicStatus ? "Yes" : "No"}
      />
      <SimpleDataDisplay
        label="Compatible Equipment"
        value={data.compatibleEquipment || "N/A"}
      />
    </div>
  );
}
