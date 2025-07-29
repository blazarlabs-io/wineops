import { DEFAULT_LOCALE } from "@/data/constants";
import { StorageCondition } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type StorageConditionsTableProps = {
  data: StorageCondition[];
};

export default function StorageConditionsTable({
  data,
}: StorageConditionsTableProps) {
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
            <TableCell key="temperature">
              <Typography variant="body2" color="textDisabled">
                Temperature
              </Typography>
            </TableCell>
            <TableCell key="humidity">
              <Typography variant="body2" color="textDisabled">
                Humidity
              </Typography>
            </TableCell>
            <TableCell key="lightLevel">
              <Typography variant="body2" color="textDisabled">
                Light level
              </Typography>
            </TableCell>
            <TableCell key="vibrationLevel">
              <Typography variant="body2" color="textDisabled">
                Vibration level
              </Typography>
            </TableCell>
            <TableCell key="iotRoom">
              <Typography variant="body2" color="textDisabled">
                IoT Room
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                <Typography>No data available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(
              ({
                id,
                date,
                temperature,
                humidity,
                lightLevel,
                vibrationLevel,
                iotRoom,
              }) => (
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
                    <Typography>{temperature}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{humidity}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{lightLevel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vibrationLevel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{iotRoom}</Typography>
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
