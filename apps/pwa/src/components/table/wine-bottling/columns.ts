/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { LotIdAndStatusCellRenderer } from "./cell-renderers/lot-id-and-status-cell-renderer";
import { QuantityCellRenderer } from "../QuantityCellRenderer";
import { LocationCellRenderer } from "./cell-renderers/location-cell-renderer";

export const columns: ColDef[] = [
  {
    headerName: "Lot ID & Lot Status",
    field: "lotId",
    minWidth: 224,
    flex: 1,
    cellRenderer: LotIdAndStatusCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Quantity Overview",
    field: "qty",
    minWidth: 264,
    flex: 1,
    cellRenderer: QuantityCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Bottling Date",
    field: "bottlingDate",
    minWidth: 156,
    flex: 1,
    cellRenderer: "agCellRenderer",
    // filter: "agSetColumnFilter",
    // filterValueGetter: (params: any) => {
    //   if (params?.data?.labData?.length > 0) {
    //     params?.data?.labData?.map((b: any) => {});
    //   }
    // },
  },
  {
    headerName: "Collection Location",
    field: "collectionLocation",
    minWidth: 172,
    flex: 1,
    cellRenderer: LocationCellRenderer,
    aggFunc: ({ values }: any) => values,
  },
  {
    field: "tasks",
    minWidth: 224,
    flex: 1,
    cellRenderer: "agCellRenderer",
  },
  {
    field: "notes",
    minWidth: 224,
    flex: 1,
    cellRenderer: "agCellRenderer",
  },
];
