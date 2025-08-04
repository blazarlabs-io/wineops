import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { Supplier, TransportationInfo } from "@/models/types/db";

type SupplierProps = {
  supplier: Supplier;
  transportationInfo: TransportationInfo;
};

export default function SupplierContent({
  supplier,
  transportationInfo,
}: SupplierProps) {
  const {
    vehicleIdNo,
    companyName,
    driverIdNo,
    certificate,
    acquisitionInvoiceNo,
  } = transportationInfo ?? {};

  return (
    <div className="grid grid-cols-4 w-full py-2 items-center justify-center">
      <SimpleDataDisplay
        label="Vehicle ID Number"
        value={vehicleIdNo ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Transportation Company"
        value={companyName ?? "N/A"}
      />
      <SimpleDataDisplay label="Driver ID/Name" value={driverIdNo ?? "N/A"} />
      <SimpleDataDisplay
        label="Certificat de Inofensivitate"
        value={certificate ?? "N/A"}
      />

      <SimpleDataDisplay
        label="Supplier Name"
        value={supplier.companyName ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Dispatch Invoice"
        value={acquisitionInvoiceNo ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Invoice No"
        value={supplier.invoiceNo ?? "N/A"}
      />
      <SimpleDataDisplay
        label="Vineyard Name"
        value={supplier.vineyardName ?? "N/A"}
      />
      <span></span>
    </div>
  );
}
