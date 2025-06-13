import { DEFAULT_LOCALE } from "@/data/constants";
import { QtyInfo } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export type QtyTableProps = {
  data: QtyInfo[];
};

export default function QtyTable({ data }: QtyTableProps) {
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
            <TableCell key="process">
              <Typography variant="body2" color="textDisabled">
                Process
              </Typography>
            </TableCell>
            <TableCell key="qty">
              <Typography variant="body2" color="textDisabled">
                Qty
              </Typography>
            </TableCell>
            <TableCell key="losses">
              <Typography variant="body2" color="textDisabled">
                Losses
              </Typography>
            </TableCell>
            {/*<TableCell key="graph">
              <Typography variant="body2" color="textDisabled">
                {`{graph}`}
              </Typography>
            </TableCell>*/}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                <Typography>No data available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(({ id, date, process, qty, losses }) => (
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
                  <Typography>{process}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{qty}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{losses}</Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
