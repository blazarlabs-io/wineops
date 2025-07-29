
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const DefaultCellRenderer = (
  params: CustomCellRendererProps & {
    alignItems?: string;
    shouldAggregate?: boolean;
    aggField?: string;
  }
) => {
  const { value, node, data, alignItems, shouldAggregate, aggField } = params;
  const isGroup = node.group || data.rowType === "group";
  const groupField = aggField || (isGroup ? node?.field : node?.parent?.field);

  const groupData =
    shouldAggregate && isGroup && groupField
      ? value && Array.isArray(value)
        ? value.map((value: any) => ({
            [groupField]: value,
          }))
        : node?.aggData
          ? node?.aggData[groupField].map((value: any) => ({
              [groupField]: value,
            }))
          : node.allLeafChildren?.map((child) => ({
              [groupField]: child.data[groupField],
            })) || []
      : [];

  const summedValue = groupData.reduce(
    (sum: number, item: any) =>
      sum + (groupField && item[groupField] ? item[groupField] : 0),
    0
  );

  return (
    <Stack
      alignItems={alignItems ? alignItems : "flex-start"}
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <>
          {shouldAggregate ? (
            <Typography variant="body1">{summedValue}</Typography>
          ) : (
            ""
          )}
        </>
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Stack>
  );
};
