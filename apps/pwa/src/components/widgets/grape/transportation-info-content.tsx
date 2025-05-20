import SimpleDataDisplay from "@/components/data-display/simple-data-display";
import { TransportationInfo } from "@/models/types/db";
import Stack from "@mui/material/Stack";
import Link from "next/link";

type TransportationInfoProps = {
  transportationInfo: TransportationInfo;
};

export default function TransportationInfoContent({
  transportationInfo,
}: TransportationInfoProps) {
  const {
    vehicleIdNo,
    companyName,
    driverIdNo,
    certificate,
    acquisitionInvoiceNo,
  } = transportationInfo ?? {};

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "flex-end", lineHeight: 1 }}>
        <Link href="" className="underline">
          Attach a document
        </Link>
      </Stack>

      {transportationInfo && (
        <div className="grid grid-cols-5 w-full p-4">
          <SimpleDataDisplay
            label="Vehicle ID Number"
            value={vehicleIdNo ?? "N/A"}
          />
          <SimpleDataDisplay
            label="Company Name"
            value={companyName ?? "N/A"}
          />
          <SimpleDataDisplay
            label="Driver ID/Name"
            value={driverIdNo ?? "N/A"}
          />
          <SimpleDataDisplay
            label="Certificat de Inofensivitate"
            value={certificate ?? "N/A"}
          />
          <SimpleDataDisplay
            label="Acquisition Invoice Number"
            value={acquisitionInvoiceNo ?? "N/A"}
          />
        </div>
      )}
    </Stack>
  );
}
