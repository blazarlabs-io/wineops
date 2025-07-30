"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export const REPORTS: {
  id: number;
  title: ReactNode;
  subtitle?: ReactNode;
  href: string;
}[] = [
  {
    id: 1,
    title: "Anexa nr. 14",
    subtitle: "Declarația privind recolta totală de struguri",
    href: "reports/anexa14",
  },
  {
    id: 2,
    title: "Anexa nr. 7",
    subtitle: "Declaraţie de stoc",
    href: "reports/anexa7",
  },
];

export default function ReportsDashboard() {
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 100px)",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "left",
          justifyContent: "center",
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography variant="h4" sx={{ flex: 1 }}>
            Reports
          </Typography>
        </Stack>

        <Stack sx={{ flex: 1, overflowY: "auto" }}>
          <Box
            sx={{
              gap: 2,
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            }}
          >
            {REPORTS.map(({ id, title, subtitle, href }) => (
              <Card
                key={id}
                sx={{
                  textAlign: "center",
                  border: "1px solid var(--mui-palette-divider) !important",
                }}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => handleClick(href)}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Typography variant="h6" component="div">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subtitle}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
