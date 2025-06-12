"use client";

import QuantityWidget from "@/components/widgets/quantity";
import TotalQuantityWidget from "@/components/widgets/total-quantity";
import TotalQuantityMui from "@/components/widgets/total-quantity/total-quantity-mui";
import { EntityStatus } from "@/models/types/dashboard";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";

export default function Widgets() {
  const [excludeV, setExcludeV] = useState<string[]>([]);

  const handleClick = (vineyard: string) => {
    if (excludeV.includes(vineyard)) {
      setExcludeV((prev) => prev.filter((v) => v !== vineyard));
    } else {
      setExcludeV((prev) => [...prev, vineyard]);
    }
  };

  const metrics = METRICS.filter(
    (metric) => !excludeV.includes(metric.vineyard)
  );

  return (
    <Stack
      gap={2}
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        direction: "column",
      }}
    >
      <Stack justifyContent="center" alignItems="center" width="100%">
        <TotalQuantityMui metrics={metrics} />

        <TotalQuantityWidget metrics={metrics} />

        <Box>
          <Button onClick={() => setExcludeV(METRICS.map((v) => v.vineyard))}>
            Remove All
          </Button>

          <Button onClick={() => setExcludeV([])}>Add All</Button>
        </Box>
      </Stack>

      <Stack
        gap={2}
        sx={{
          maxHeight: "700px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        {METRICS.map(({ vineyard, status, actual, supply, demand }) => (
          <Stack
            key={vineyard}
            gap={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Box>
              <QuantityWidget
                status={status}
                actual={actual}
                supply={supply}
                demand={demand}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              {vineyard} ({status})
            </Box>
            <Box
              sx={{
                width: "80px",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "right",
                mr: 2,
              }}
            >
              <Button onClick={() => handleClick(vineyard)}>
                {excludeV.includes(vineyard) ? "Add" : "Remove"}
              </Button>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

const METRICS = [
  {
    vineyard: "V1",
    status: "Harvesting" as EntityStatus,
    actual: 30,
    supply: 30,
    demand: 25,
  },
  {
    vineyard: "V2",
    status: "Harvesting" as EntityStatus,
    actual: 5,
    supply: 15,
    demand: 30,
  },
  {
    vineyard: "V3",
    status: "Harvesting" as EntityStatus,
    actual: 5,
    supply: 15,
    demand: 10,
  },
  {
    vineyard: "V4",
    status: "Harvesting" as EntityStatus,
    actual: 1,
    supply: 2,
    demand: 1,
  },
  {
    vineyard: "V5",
    status: "Ready for Harvest" as EntityStatus,
    actual: 0,
    supply: 10,
    demand: 16,
  },
  {
    vineyard: "V6",
    status: "Ready for Harvest" as EntityStatus,
    actual: 0,
    supply: 10,
    demand: 10,
  },
  {
    vineyard: "V7",
    status: "Harvest Ended" as EntityStatus,
    actual: 55,
    supply: 30,
    demand: 10,
  },
  {
    vineyard: "V8",
    status: "Harvest Ended" as EntityStatus,
    actual: 23,
    supply: 20,
    demand: 14,
  },
  {
    vineyard: "V9",
    status: "Harvest Ended" as EntityStatus,
    actual: 5,
    supply: 20,
    demand: 14,
  },
  {
    vineyard: "V10",
    status: "Harvest Ended" as EntityStatus,
    actual: 18,
    supply: 20,
    demand: 14,
  },
];
