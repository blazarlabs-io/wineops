import { DEFAULT_LOCALE } from "@/data/constants";
import { VesselHistory, VesselType } from "@/models/types/db";
import formatDate, { parseToDate } from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export type HistoryTableProps = {
  type?: VesselType;
  data: VesselHistory[];
};

export default function HistoryTable({ type, data }: HistoryTableProps) {
  const sortedData = data.sort((a, b) => {
    const dateA =
      parseToDate(a.dateOut) ?? parseToDate(a.dateIn) ?? new Date(0);
    const dateB =
      parseToDate(b.dateOut) ?? parseToDate(b.dateIn) ?? new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

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
            <TableCell key="barrelUsageStatus" className="font-bold">
              <Typography variant="body2" color="textDisabled">
                {type} Usage Status
              </Typography>
            </TableCell>
            <TableCell key="batchID">
              <Typography variant="body2" color="textDisabled">
                Batch ID
              </Typography>
            </TableCell>
            <TableCell key="dateIn">
              <Typography variant="body2" color="textDisabled">
                Date In
              </Typography>
            </TableCell>
            <TableCell key="dateOut">
              <Typography variant="body2" color="textDisabled">
                Date Out
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                <Typography>No history available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map(({ id, usage, batchID, dateIn, dateOut }) => (
              <TableRow key={id}>
                <TableCell>
                  <Typography>{usage}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{batchID}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {dateIn && formatDate(dateIn, { locale: DEFAULT_LOCALE })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {dateOut && formatDate(dateOut, { locale: DEFAULT_LOCALE })}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
