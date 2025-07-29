import { DEFAULT_LOCALE } from "@/data/constants";
import { MustInfo } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type MustInfoTableProps = {
  data: MustInfo[];
};

export default function MustInfoTable({ data }: MustInfoTableProps) {
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
            <TableCell key="batchID">
              <Typography variant="body2" color="textDisabled">
                Batch ID
              </Typography>
            </TableCell>
            <TableCell key="supplier">
              <Typography variant="body2" color="textDisabled">
                Supplier
              </Typography>
            </TableCell>
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
            data.map(({ id, date, grapeVariety, qty, name, companyName }) => (
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
                <TableCell>
                  <Typography>{name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{companyName}</Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
