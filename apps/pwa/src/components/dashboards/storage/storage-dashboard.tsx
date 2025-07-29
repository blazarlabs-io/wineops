"use client";

import { Box, Stack, styled, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import StorageTable from "@/components/table/storage";
import { ButtonType } from "@/components/widgets/tools-bar/constants";

import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import { Liquor, LocalBar, WineBar } from "@mui/icons-material";
import { SyntheticEvent, useMemo, useState } from "react";
import { useMust } from "@/context/must";
import { useWine } from "@/context/wine";
import { Must, MustStatus, Wine, WineStatus } from "@/models/types/db";
import { useGridStore } from "@/store/grid";

export default function StorageDashboard() {
  const [storageType, setStorageType] = useState(0);

  const { groupedField, setGroupedField } = useGridStore();

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setStorageType(newValue);

    if (
      groupedField &&
      ["groupByMustName", "groupByWineName"].includes(groupedField)
    ) {
      if (storageType === 0 && groupedField === "groupByMustName") {
        setGroupedField("groupByWineName");
      }
      if (storageType === 1 && groupedField === "groupByWineName") {
        setGroupedField("groupByMustName");
      }
    }
  };

  const { musts } = useMust();
  const { wines } = useWine();

  const hasStoredMusts = useMemo(
    () => hasEntitiesWithStatus(musts, MustStatus.STORED),
    [musts],
  );

  const hasStoredWines = useMemo(
    () => hasEntitiesWithStatus(wines, WineStatus.STORED),
    [wines],
  );

  const hasBottledWines = false;

  const StyledTabs = styled((props: TabsProps) => <Tabs {...props} />)({
    margin: "0px",
    padding: "0px",
    marginTop: "4px",
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
  });

  const StyledTab = styled((props: TabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    minHeight: "34px",
    "&.Mui-selected": {},
    "&.Mui-focusVisible": {},
  }));

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
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
        <Stack gap={2} direction="row">
          <Typography variant="h4">Storage</Typography>

          <Stack direction="row">
            <StyledTabs
              value={storageType}
              onChange={handleChange}
              aria-label="storage"
            >
              <StyledTab
                label="Must"
                icon={<WineBar />}
                iconPosition="start"
                disabled={!hasStoredMusts}
              />

              <StyledTab
                label="Wine"
                icon={<LocalBar />}
                iconPosition="start"
                disabled={!hasStoredWines}
              />

              <StyledTab
                label="Bottled Wine"
                icon={<Liquor />}
                iconPosition="start"
                disabled={!hasBottledWines}
              />
            </StyledTabs>
          </Stack>
        </Stack>

        <ToolsBar
          buttons={{
            [ButtonType.ADD]: { hide: true },
            [ButtonType.EDIT]: { hide: true },
            [ButtonType.DELETE]: { hide: true },
            [ButtonType.GROUP]: { hide: true },
            [ButtonType.UNGROUP]: { hide: true },
            [ButtonType.PIVOT]: {
              enabled: hasStoredMusts || hasStoredWines || hasBottledWines,
            },
          }}
          {...((hasStoredMusts || hasStoredWines || hasBottledWines) && {
            groupByButtons: [
              { name: "by Location", columnName: "groupByLocation" },
              {
                name: `by ${storageType === 1 ? "Wine" : "Must"} Name`,
                columnName:
                  storageType === 1 ? "groupByWineName" : "groupByMustName",
              },
              { name: "by Vessel Type", columnName: "groupByVesselType" },
            ],
          })}
        />

        <StorageTable storageType={storageType} />
      </Stack>
    </Box>
  );
}

const hasEntitiesWithStatus = (
  entities: (Must | Wine)[],
  entityStatus: typeof MustStatus.STORED | typeof WineStatus.STORED,
) =>
  entities.filter(
    ({ status, vessels }) =>
      status === entityStatus &&
      !!vessels &&
      Array.isArray(vessels) &&
      vessels.length > 0,
  )?.length > 0;
