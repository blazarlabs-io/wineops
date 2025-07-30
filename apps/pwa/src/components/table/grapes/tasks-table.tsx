import { DEFAULT_LOCALE } from "@/data/constants";
import { Task } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type TasksTableProps = {
  data: Task[];
};

export default function TasksTable({ data }: TasksTableProps) {
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
            <TableCell key="title" className="font-bold">
              <Typography variant="body2" color="textDisabled">
                Title
              </Typography>
            </TableCell>
            <TableCell key="assignedTo">
              <Typography variant="body2" color="textDisabled">
                Assigned to
              </Typography>
            </TableCell>
            <TableCell key="priority">
              <Typography variant="body2" color="textDisabled">
                Priority
              </Typography>
            </TableCell>
            <TableCell key="startDate">
              <Typography variant="body2" color="textDisabled">
                Start Date
              </Typography>
            </TableCell>
            <TableCell key="dueDate">
              <Typography variant="body2" color="textDisabled">
                Due Date
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                <Typography>No tasks available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(
              ({ id, title, assignedTo, priority, startDate, dueDate }) => (
                <TableRow key={id}>
                  <TableCell>
                    <Typography>{title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{`${assignedTo?.name || ""} ${assignedTo?.lastName || ""}`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{priority}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {startDate &&
                        formatDate(startDate, { locale: DEFAULT_LOCALE })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {dueDate &&
                        formatDate(dueDate, { locale: DEFAULT_LOCALE })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
