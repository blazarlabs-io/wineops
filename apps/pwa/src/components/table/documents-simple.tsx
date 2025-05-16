import { convertIsoToShortDate } from "@/helpers/date-helpers";
import { SingleDocument } from "@/models/types/db";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@repo/ui/components/base/table';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

export type DocumentsSimpleTableProps = {
  data: SingleDocument[];
};

export default function DocumentsSimpleTable({
  data,
}: DocumentsSimpleTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <Typography>A list of your recent documents.</Typography>
        <TableHead>
          <TableRow>
            <TableHead className="font-bold">File Name</TableHead>
            <TableHead className="font-bold">Owner</TableHead>
            <TableHead className="font-bold">Upload Date</TableHead>
            <TableHead className="font-bold">File Size</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <TableRow key={item.id + item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.owner.name}</TableCell>
                <TableCell>{convertIsoToShortDate(item.uploadDate)}</TableCell>
                <TableCell className="text-left">
                  {item.media.sizeMb} MB
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
