import { ReactNode } from "react";
import Stack from "@mui/material/Stack";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export default function TabPanel({
  children,
  value,
  index,
  ...other
}: TabPanelProps) {
  return (
    <Stack
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {value === index && (
        <Stack
          sx={{
            p: 2,
            height: "100%",
            justifyContent: "center",
          }}
        >
          {children}
        </Stack>
      )}
    </Stack>
  );
}
