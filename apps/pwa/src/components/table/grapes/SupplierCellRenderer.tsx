/* eslint-disable @typescript-eslint/no-explicit-any */
import { GROUP_ITEMS_TO_SHOW, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Icon } from "@iconify/react";
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

  const vineyardName =
    value?.supplier?.vineyardName || data?.supplier?.vineyardName;
  const hasTransportationInfo =
    data?.transportationInfo?.vehicleIdNo ||
    data?.transportationInfo?.companyName;

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
        <Stack>
          {(vineyardName || value?.companyName) && (
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Icon
                icon={
                  vineyardName
                    ? "lucide:shopping-basket"
                    : "lucide:shopping-cart"
                }
                width={16}
              />
              <Typography>
                {vineyardName ? vineyardName : value?.companyName}
              </Typography>
            </Stack>
          )}

          {hasTransportationInfo && (
            <Stack direction="row" alignItems="center" gap={1}>
              <Icon icon="tabler:truck" width={16} />

              <Stack>
                <Typography variant="body2" color="text.secondary">
                  {data?.transportationInfo?.vehicleIdNo}
                </Typography>

                <Typography variant="body2">
                  {data?.transportationInfo?.companyName}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
