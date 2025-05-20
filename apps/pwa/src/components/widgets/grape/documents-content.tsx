import DocumentsTable from "@/components/table/grapes/documents-table";
import { SingleDocument } from "@/models/types/db";
import Stack from "@mui/material/Stack";
import Link from "next/link";

type DocumentsProps = {
  documents: SingleDocument[];
};

export default function DocumentsContent({ documents }: DocumentsProps) {
  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "flex-end", lineHeight: 1 }}>
        {documents && documents.length > 0 && (
          <Link href="" className="underline mr-4">
            View All
          </Link>
        )}
        <Link href="" className="underline">
          Attach a document
        </Link>
      </Stack>

      <DocumentsTable data={documents} />
    </Stack>
  );
}
