import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Chemistry } from "@/models/types/db";
import formatDate from "@/utils/date-format";

type SupplyInfoProps = {
  data: Partial<Chemistry>;
};

export default function SupplyContent({ data }: SupplyInfoProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-4 w-full">
      <SimpleDataDisplay
        label="Order Date"
        value={data?.orderDate ? formatDate(data.orderDate) : "N/A"}
      />
      <SimpleDataDisplay label="Qty" value={data?.qty || "N/A"} />
      <SimpleDataDisplay label="Invoice No" value={data?.invoiceNo || "N/A"} />
      <SimpleDataDisplay
        label="Manufacturer"
        value={data?.manufacturer || "N/A"}
      />
      <SimpleDataDisplay
        label="Certificat calitate"
        value={data?.certificatCalitate || "N/A"}
      />
      <SimpleDataDisplay
        label="Expiry date"
        value={data?.expiryDate ? formatDate(data.expiryDate) : "N/A"}
      />
      <SimpleDataDisplay
        label="Minimum Stock Alert"
        value={data?.minimumStockAlert || "N/A"}
      />
    </div>
  );
}
