import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Stack } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import { useGrape } from "@/context/grape";
import { ActionRelation } from "@/models/types/actions";
import { Grape } from "@/models/types/db";
import TotalQuantityPieWidget from "@/components/widgets/total-quantity/total-qty-pie";

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

  const supply = 0;
  const demand = 0;

  const unit = (result
    .map((item) => item.metrics?.unit)
    .filter((unit) => unit) || [])[0];

  const metrics = (node?.allLeafChildren || []).flatMap(({ data }) =>
    (data?.batches || []).map((batch: { id: string }) => {
      const grape = grapes.find(({ id }) => id === batch.id);

      return {
        actual: grape?.metrics?.actual,
        supply: 0,
        demand: 0,
        status: data?.status,
        unit: grape?.metrics?.unit,
      };
    })
  );

  // const isGroup = node?.group || node?.data?.rowType === "group";

  // console.log("\n\n+++++++++++++++++++++++++++++++++++");
  // console.log("value", value);
  // console.log("node", node);
  // console.log("result", result);
  // console.log("metrics", metrics);
  // console.log("+++++++++++++++++++++++++++++++++++\n\n");

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {node.group ? (
        <Stack height="100%" alignItems="flex-start" justifyContent="center">
          <TotalQuantityPieWidget metrics={metrics} width={80} height={80} />
        </Stack>
      ) : (
        <QuantityWidget
          actual={value}
          supply={supply}
          demand={demand}
          status={value?.status || node.data?.status}
          unit={unit}
        />
      )}
    </Box>
  );
};
