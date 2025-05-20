import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Supplier } from "@/models/types/db";

type SupplierProps = {
  supplier: Supplier;
};

export default function SupplierContent({ supplier }: SupplierProps) {
  if (!supplier) return null;

  return (
    <div className="grid grid-cols-5 w-full p-4 py-2">
      <SimpleDataDisplay
        label="Company Name"
        value={supplier.companyName ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Dispatch Invoice"
        value={supplier.dispatchInvoice ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Invoice No"
        value={supplier.invoiceNo ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Vineyard Name"
        value={supplier.vineyardName ?? "N/A"}
      />
    </div>
  );
}
