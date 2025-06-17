import { ExpandableUsage } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export type UsageTableProps = {
  data: ExpandableUsage[];
};

export default function UsageTable({ data }: UsageTableProps) {
  const inUseToday = data
    .filter(({ inUseToday }) => inUseToday)
    .map(({ inUseToday, inUseThisWeek, ...rest }) => ({
      ...rest,
      value: inUseToday,
    }));

  const inUseThisWeek = data
    .filter(({ inUseThisWeek }) => inUseThisWeek)
    .map(({ inUseToday, inUseThisWeek, ...rest }) => ({
      ...rest,
      value: inUseThisWeek,
    }));
  const sortedInUseToday = inUseToday.sort(sortByDate);
  const sortedInUseThisWeek = inUseThisWeek.sort(sortByDate);

  const missingData =
    sortedInUseToday.length === 0 && sortedInUseThisWeek.length === 0;

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
        {missingData && <Header />}

        {missingData && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                <Typography>No data available.</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {sortedInUseToday.length > 0 && (
          <>
            <Header label="In use/Today" />
            <Body data={sortedInUseToday} />
          </>
        )}

        {sortedInUseThisWeek.length > 0 && (
          <>
            <Header label="In use/This Week" />
            <Body data={sortedInUseThisWeek} />
          </>
        )}
      </Table>
    </TableContainer>
  );
}

const Header = ({ label = "In use" }: { label?: string }) => (
  <TableHead>
    <TableRow>
      <TableCell key="inUseToday" className="font-bold">
        <Typography variant="body2" color="textDisabled">
          {label}
        </Typography>
      </TableCell>
      <TableCell key="process">
        <Typography variant="body2" color="textDisabled">
          Process
        </Typography>
      </TableCell>
      <TableCell key="person">
        <Typography variant="body2" color="textDisabled">
          Person
        </Typography>
      </TableCell>
      <TableCell key="location">
        <Typography variant="body2" color="textDisabled">
          Location
        </Typography>
      </TableCell>
    </TableRow>
  </TableHead>
);

const Body = ({
  data,
}: {
  data: (Omit<ExpandableUsage, "inUseToday" | "inUseThisWeek"> & {
    value?: number;
  })[];
}) => (
  <TableBody>
    {data.map(({ id, value, location, person, process }) => (
      <TableRow key={id}>
        <TableCell>
          <Typography>{value}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{process}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{person}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{location}</Typography>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const sortByDate = (a: ExpandableUsage, b: ExpandableUsage) =>
  (parseToDate(a.createdAt)?.getTime() ?? 0) -
  (parseToDate(b.createdAt)?.getTime() ?? 0);
