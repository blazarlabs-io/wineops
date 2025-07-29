import { GROUP_ITEMS_TO_SHOW, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Link } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const SupplierCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const supplier: any[] = node?.aggData?.supplier ?? [];
  const batchesSuppliers = isGroup
    ? supplier
        .filter((supplier) => supplier && supplier.companyName)
        .map(({ companyName }) => companyName)
    : [];

  const uniqueSuppliers = [...new Set(batchesSuppliers)];

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <>
          {uniqueSuppliers.map((supplier, index) =>
            index < GROUP_ITEMS_TO_SHOW ? (
              <Stack key={`${supplier}-${index}`}>
                <Typography variant="body2">{supplier}</Typography>
              </Stack>
            ) : (
              index === GROUP_ITEMS_TO_SHOW && (
                <Link href="#" key={index}>
                  + {uniqueSuppliers.length - GROUP_ITEMS_TO_SHOW} more
                </Link>
              )
            ),
          )}
        </>
      ) : (
        <Typography>{value?.companyName}</Typography>
      )}
    </Stack>
  );
};
