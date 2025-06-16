import { DEFAULT_LOCALE } from "@/data/constants";
import { BulkInfo } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export type BulkInfoTableProps = {
  data: BulkInfo[];
};

export default function BulkInfoTable({ data }: BulkInfoTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        height: "100%",
        width: "100%",
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
            <TableCell key="date">
              <Typography variant="body2" color="textDisabled">
                Date, Time
              </Typography>
            </TableCell>
            <TableCell key="components">
              <Typography variant="body2" color="textDisabled">
                Components
              </Typography>
            </TableCell>
            <TableCell key="qty">
              <Typography variant="body2" color="textDisabled">
                Qty
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                <Typography>No data available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(({ id, date, grapeVariety, qty }) => (
              <TableRow key={id}>
                <TableCell>
                  <Typography>
                    {date &&
                      formatDate(date, {
                        locale: DEFAULT_LOCALE,
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{grapeVariety}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{qty}</Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
