import {
  Add,
  SelectAll,
  DeleteOutline,
  Tune,
  SwapVert,
} from "@mui/icons-material";
import { Box, Fab, IconButton } from "@mui/material";
import { EditIcon, Search } from "lucide-react";

export default function ToolsBar() {
  return (
    <Box className="flex items-center w-full">
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        gap={1}
        alignItems={"center"}
        className=""
      >
        <Fab
          color="primary"
          size="small"
          aria-label="add"
          className="shadow-xs"
          sx={{
            minWidth: "40px",
          }}
        >
          <Add className="" />
        </Fab>
        <Fab
          color="primary"
          size="small"
          aria-label="edit"
          className="shadow-xs"
          sx={{
            minWidth: "40px",
          }}
        >
          <EditIcon className="w-[18px] h-[18px]" />
        </Fab>
        <Fab
          color="primary"
          size="small"
          aria-label="add"
          className="shadow-xs"
          sx={{
            minWidth: "40px",
          }}
        >
          <SelectAll className="" />
        </Fab>
        <Fab
          color="error"
          size="small"
          aria-label="add"
          className="shadow-xs"
          sx={{
            minWidth: "40px",
          }}
        >
          <DeleteOutline className="" />
        </Fab>

        <IconButton
          color="inherit"
          aria-label="filter"
          onClick={() => {
            console.log("filter");
          }}
          className="ml-auto"
        >
          <Tune />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="filter"
          onClick={() => {
            console.log("filter");
          }}
          className=""
        >
          <SwapVert />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="filter"
          onClick={() => {
            console.log("filter");
          }}
          className=""
        >
          <Search />
        </IconButton>
        {/* </Box> */}
      </Box>
    </Box>
  );
}
