import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { SingleActionEntity } from "@/models/types/actions";
import { Icon } from "@iconify/react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

export interface QuickActionsWidgetStepOneProps<T extends SingleActionEntity> {
  title: string;
  selectedAction?: T;
  onBackClick: () => void;
}

export default function QuickActionsWidgetStepTwo<
  T extends SingleActionEntity,
>({ title, selectedAction, onBackClick }: QuickActionsWidgetStepOneProps<T>) {
  console.log("selectedAction", selectedAction);
  return (
    <Box
      pl={2}
      pb={2}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      className="pointer-events-auto overflow-x-hidden"
      height={"100%"}
      width="100%"
      minWidth={RIGHT_DRAWER_WIDTH}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={1}
        className="absolute top-[80px] left-2"
      >
        <Button
          variant="text"
          size="small"
          style={{
            color: "var(--mui-palette-text-light)",
          }}
          startIcon={<Icon icon={"mdi:arrow-left"} />}
          type="button"
          onClick={onBackClick}
        >
          <Typography variant="body2">Back</Typography>
        </Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <Icon icon={selectedAction?.icon as string} width={24} height={24} />
        <Typography variant="h5" className="capitalize">
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          minWidth: RIGHT_DRAWER_WIDTH,
          maxWidth: RIGHT_DRAWER_WIDTH,
          overflowX: "hidden",
          height: "100%",
          maxHeight: "90% !important",
        }}
        // className="debug-red"
      >
        <Stack gap={2} py={2} height="100%" pr={2}>
          {/* *Form */}
          <React.Fragment>{selectedAction?.form}</React.Fragment>
        </Stack>
      </Box>
      {/* <Box display={"flex"} justifyContent={"end"}>
        <Button variant="contained">
          <Icon icon={"mdi:check"} width={24} height={24} />
        </Button>
      </Box> */}
    </Box>
  );
}
