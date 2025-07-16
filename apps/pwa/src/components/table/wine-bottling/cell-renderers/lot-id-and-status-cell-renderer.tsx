import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Chip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";

export const LotIdAndStatusCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  const [openCollections, setOpenCollections] = useState<boolean>(false);

  const isGroup = node?.group || node?.data?.rowType === "group";

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!isGroup && (
        <div className="flex flex-col items-start justify-start gap-[4px]! ">
          <Typography variant="body2" className="font-semibold max-h-fit!">
            {value}
          </Typography>
          <Chip
            label={node.data.lotStatus}
            variant="outlined"
            className="m-0! p-0! max-h-fit"
          />
        </div>
      )}
    </Box>
  );
};
