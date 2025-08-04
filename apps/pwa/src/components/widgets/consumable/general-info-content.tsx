import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Consumable } from "@/models/types/db";
import formatDate from "@/utils/date-format";

type GeneralInfoProps = {
  data: Partial<Consumable>;
};

export default function GeneralInfoContent({ data }: GeneralInfoProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-3 w-full">
      <SimpleDataDisplay
        label="Manufacturer"
        value={data.manufacturer || "N/A"}
      />
      <SimpleDataDisplay
        label="Certificat calitate"
        value={data.certificatCalitate || "N/A"}
      />
      <SimpleDataDisplay
        label="Order Date"
        value={data?.orderDate ? formatDate(data.orderDate) : "N/A"}
      />
      <SimpleDataDisplay label="Invoice No" value={data.invoiceNo || "N/A"} />
      <SimpleDataDisplay label="Quantity" value={data.qty || "N/A"} />
      <SimpleDataDisplay
        label="Minimum Stock Alert"
        value={data.minimumStockAlert || "N/A"}
      />
    </div>
  );
}
