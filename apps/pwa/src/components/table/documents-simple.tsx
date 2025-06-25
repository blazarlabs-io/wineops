/* eslint-disable @typescript-eslint/no-explicit-any */
import { Delete, DeleteOutline, Download } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export type DocumentsSimpleTableProps = {
  data: any[];
};

export default function DocumentsSimpleTable({
  data,
}: DocumentsSimpleTableProps) {
  const handleDownloadDocument = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        display: "flex",
        alignItems: "start",
        height: "224px",
        width: "100%",
        paddingRight: 8,
        background: "transparent",
        paddingX: 2,
        paddingY: 1,
        border: "1px solid var(--mui-palette-divider)",
        overflowY: "scroll",
      }}
    >
      <Table
        size="small"
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
              <Typography>Document Type</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>Upload Date</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography>Owner Name & Email</Typography>
            </TableCell>
            <TableCell className="font-bold">
              <Typography></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <>
                <TableRow
                  key={item.id + item.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className="font-medium">
                    <Typography color="textSecondary">
                      {item.name.split(".").slice(0, -1).join(".") || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      .{item.name.split(".").pop() || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {item.date.toDate().toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {item.responsible.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleDownloadDocument(item.url)}
                    >
                      <Download />
                    </Button>
                    <Button size="small">
                      <DeleteOutline color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
