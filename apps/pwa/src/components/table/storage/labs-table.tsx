import { DEFAULT_LOCALE } from "@/data/constants";
import { MustLabData } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type LabsTableProps = {
  data: MustLabData[];
};

export default function LabsTable({ data }: LabsTableProps) {
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
                Date
              </Typography>
            </TableCell>
            <TableCell key="alcohol">
              <Typography variant="body2" color="textDisabled">
                Alcohol
              </Typography>
            </TableCell>
            <TableCell key="sugar">
              <Typography variant="body2" color="textDisabled">
                Sugar (g/dm³)
              </Typography>
            </TableCell>
            <TableCell key="acidity">
              <Typography variant="body2" color="textDisabled">
                Acidity (g/dm³)
              </Typography>
            </TableCell>
            <TableCell key="volatileAcidity">
              <Typography variant="body2" color="textDisabled">
                Volatile Acidity (g/L)
              </Typography>
            </TableCell>
            <TableCell key="extraLabs">
              <Typography variant="body2" color="textDisabled">
                Extra labs
              </Typography>
            </TableCell>
            <TableCell key="labTechnicianName">
              <Typography variant="body2" color="textDisabled">
                Lab technician name
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                <Typography>No data available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(
              ({
                date,
                alcohol,
                sugar,
                acidity,
                volatileAcidity,
                labTechnicianName,
              }) => (
                <TableRow key={date.toString()}>
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
                    <Typography>{alcohol?.value || ""}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{sugar?.value || ""}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{acidity?.value || ""}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{volatileAcidity?.value || ""}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography></Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{labTechnicianName}</Typography>
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
