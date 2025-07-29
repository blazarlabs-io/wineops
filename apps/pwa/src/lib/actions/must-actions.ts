import {
  Must,
  MustStatus,
  MustWineVessel,
  MustWithVessel,
  RowType,
  Wine,
  WineStatus,
} from "@/models/types/db";
import { db } from "../firebase/services";
import { enqueueSnackbar } from "notistack";
import { ActionRelation, MustDecantAction } from "@/models/types/actions";

export const mustDecantAction = async (
  uid: string,
  actionData: MustDecantAction,
  must: MustWithVessel,
  mustVessel?: MustWineVessel
) => {

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
    return;
  }

  const updatedMust = {
    actions: [
      ...(must.actions || ([] as ActionRelation[])),
      {
        id: actionData.id,
        name: "must-decant",
      },
    ],

    status: MustStatus.DECANTED,
    ...(must.metrics?.actual &&
      actionData?.initialQty && {
        metrics: {
          ...must.metrics,
          actual: must.metrics.actual - actionData.initialQty,
        },
      }),
    vessels: must?.vessels?.map((vessel) => ({
      ...vessel,
      qty:
        mustVessel?.id && actionData?.initialQty && vessel.id === mustVessel.id
          ? vessel.qty - actionData?.initialQty
          : vessel.qty,
    })),
  };

  const mustRes = await db.must.update(uid, must.id, updatedMust);

  if (mustRes.status === 200) {
    enqueueSnackbar("Must updated", { variant: "success" });
  } else {
    enqueueSnackbar("Error updating must", { variant: "error" });
    return;
  }

  const newEntityVessels = {
    ...(actionData.vessels && {
      vessels: actionData.vessels.map(
        ({ id, qty, name, location = "", type }) => ({
          id,
          type,
          name,
          location,
          qty,
        })
      ),
    }),
  };

  const notes = [
    {
      id: Date.now().toString(),
      title: "",
      content: actionData.notes || "",
      date: new Date().toDateString(),
    },
  ];

  if (actionData?.moveToWine) {

    const newWine: Wine = {
      id: Date.now().toString(),
      name: actionData.wineName || "WineName",
      date: actionData.executionDate,
      group: [actionData.wineName || "WineName"],
      rowType: RowType.ITEM,
      status: WineStatus.NEW_WINE,
      metrics: {
        actual: actionData.obtainedWineQty || 0,
        supply: 0,
        demand: 0,
      },
      ...newEntityVessels,
      ...(must?.grapeVariety && {
        grapeVarieties: [
          {
            id: Date.now().toString(),
            name: must.grapeVariety,
            percentage: 100,
          },
        ],
      }),
      ...(actionData.notes && { notes }),
      ...(actionData?.consumables && { consumables: actionData.consumables }),
    };

    const wineRes = await db.wine.create(uid, newWine);

    if (wineRes.status === 200) {
      enqueueSnackbar("Wine created", { variant: "success" });
    } else {
      enqueueSnackbar("Error creating wine", { variant: "error" });
      return;
    }
  } else {

    const newMust: Must = {
      id: Date.now().toString(),
      name: actionData.wineName || "MustName",
      date: actionData.executionDate,
      group: [actionData.wineName || "MustName"],
      rowType: RowType.ITEM,
      status: MustStatus.NEW_MUST,
      metrics: {
        actual: actionData.obtainedWineQty || 0,
        supply: 0,
        demand: 0,
      },
      ...newEntityVessels,
      ...(must?.grapeVariety && { grapeVariety: must.grapeVariety }),
      ...(actionData.notes && { notes }),
      ...(actionData?.consumables && { consumables: actionData.consumables }),
    };

    const mustRes = await db.must.create(uid, newMust);

    if (mustRes.status === 200) {
      enqueueSnackbar("Must created", { variant: "success" });
    } else {
      enqueueSnackbar("Error creating must", { variant: "error" });
      return;
    }
  }
};
