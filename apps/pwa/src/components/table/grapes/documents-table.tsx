import { SingleDocument } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export type DocumentsTableProps = {
  data: SingleDocument[];
};

export default function DocumentsTable({ data }: DocumentsTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        height: "100%",
        width: "100%",
        padding: 2,
        minWidth: "fit-window",
        background: "transparent",
      }}
      className="w-full"
    >
      <Table
        sx={{
          minWidth: "fit-window",
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        className="w-full"
      >
        <TableHead>
          <TableRow>
            <TableCell key="date" className="font-bold">
              <Typography variant="body2" color="textDisabled">
                Date
              </Typography>
            </TableCell>
            <TableCell key="fileName">
              <Typography variant="body2" color="textDisabled">
                File Name
              </Typography>
            </TableCell>
            <TableCell key="fileId">
              <Typography variant="body2" color="textDisabled">
                File ID
              </Typography>
            </TableCell>
            <TableCell key="responsible">
              <Typography variant="body2" color="textDisabled">
                Responsible
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography>No documents available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(({ id, name, owner, uploadDate }) => (
              <TableRow key={id}>
                <TableCell>
                  <Typography>
                    {formatDate(uploadDate, { locale: "ro-RO" })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{owner.name}</Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
