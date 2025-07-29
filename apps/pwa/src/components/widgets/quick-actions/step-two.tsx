import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { SingleActionEntity } from "@/models/types/actions";
import { Icon } from "@iconify/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

interface QuickActionsWidgetStepOneProps<T extends SingleActionEntity> {
  title: string;
  selectedAction?: T;
  onBackClick: () => void;
}

export default function QuickActionsWidgetStepTwo<
  T extends SingleActionEntity,
>({ title, selectedAction, onBackClick }: QuickActionsWidgetStepOneProps<T>) {
  const FormComponent = selectedAction?.form;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      className="pointer-events-auto overflow-x-hidden"
      height="100%"
      width="100%"
      minWidth={RIGHT_DRAWER_WIDTH}
    >
      <Box
        display="flex"
        alignItems="center"
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
      <Box display="flex" alignItems="center" gap={1} px={2}>
        {selectedAction?.icon && (
          <Icon icon={selectedAction?.icon} width={24} height={24} />
        )}
        <Typography variant="h5" className="capitalize text-[22px]!">
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          minWidth: RIGHT_DRAWER_WIDTH,
          maxWidth: RIGHT_DRAWER_WIDTH,
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <Stack height="100%">
          {}
          <React.Fragment>
            {FormComponent && (
              <FormComponent
                onBackClick={onBackClick}
                actionKey={selectedAction?.key}
              />
            )}
          </React.Fragment>
        </Stack>
      </Box>
      {}
    </Box>
  );
}
