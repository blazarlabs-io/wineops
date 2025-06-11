import { convertIsoToShortDate } from "@/helpers/date-helpers";
import { SingleDocument } from "@/models/types/db";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export type DocumentsSimpleTableProps = {
  data: SingleDocument[];
};

export default function DocumentsSimpleTable({
  data,
}: DocumentsSimpleTableProps) {
  console.log(data);
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: "flex",
        alignItems: "start",
        height: "280px",
        width: "100%",
        paddingRight: 8,
        background: "transparent",
        padding: 4,
      }}
    >
      <Table
        sx={{
          minWidth: "fit-content",
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        className="w-full"
      >
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">
              <Typography>File Name</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>Owner Name</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>Owner Email</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>Uploaded</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>File Ext.</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>File Size</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <>
                <TableRow key={item.id + item.name}>
                  <TableCell className="font-medium">
                    <Typography color="textSecondary">{item.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {item.owner.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {item.owner.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {convertIsoToShortDate(item.uploadDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      .{item.media.subtype}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-left">
                    <Typography color="textSecondary">
                      {item.media.sizeMb} MB
                    </Typography>
                  </TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
