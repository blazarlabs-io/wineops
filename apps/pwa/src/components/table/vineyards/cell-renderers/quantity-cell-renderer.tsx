import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Stack } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import { useGrape } from "@/context/grape";
import { ActionRelation } from "@/models/types/actions";
import { Grape } from "@/models/types/db";
import TotalQuantityWidget from "@/components/widgets/total-quantity";

export const QuantityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, node }) => {
  const { grapes } = useGrape();

  const batches = node.data?.batches || [];

  const result = grapes.filter((item: Grape) =>
    batches.some((b: ActionRelation) => b.id === item.id)
  );

  // const batch = grapes.filter((grape) => {
  //   console.log("grape", grape.id, node.data);
  //   if (!node.data?.batch?.id || !grape) return null;
  //   if (grape?.id === node.data?.batch?.id) return grape;
  // });

  const actualArr = result.map((item) => item.metrics?.actual || 0); //result[0]?.metrics?.actual || 0;
  const actual = actualArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const supply = 0;
  const demand = 0;

  const metrics = (node?.allLeafChildren || []).map(({ data }) => ({
    actual: data?.forecastedYield,
    status: data?.status,
  }));

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {node.group ? (
        <Stack
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <TotalQuantityWidget metrics={metrics} />
        </Stack>
      ) : (
        <QuantityWidget
          actual={actual}
          supply={supply}
          demand={demand}
          status={node.data?.status}
        />
      )}
    </Box>
  );
};
