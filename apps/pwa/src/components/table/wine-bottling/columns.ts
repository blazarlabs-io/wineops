/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";

export const columns: ColDef[] = [
  {
    headerName: "Lot ID & Lot Status",
    field: "lotId",
    minWidth: 224,
    flex: 1,
    cellRenderer: "agCellRenderer",
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Quantity Overview",
    field: "qty",
    minWidth: 184,
    flex: 1,
    cellRenderer: "agCellRenderer",
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Bottling Date",
    field: "bottlingDate",
    minWidth: 196,
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
    minWidth: 124,
    flex: 1,
    cellRenderer: "agCellRenderer",
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
