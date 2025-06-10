import { GrapeStatus } from "@/models/types/db";
import { db } from "../firebase/services";
import { enqueueSnackbar } from "notistack";
import { ActionRelation } from "@/models/types/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const grapeIntakeAction = async (
  uid: string,
  actionData: any,
  grape: any
) => {
  console.log("grapeIntakeAction", uid, actionData, grape);

  // * 1. write new action object into DB andreference it in the grape

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  // * 2. update grape object into DB

  const grapeRes = await db.grape.update(uid, grape.id, {
    actions: [
      ...(grape.actions || ([] as ActionRelation[])),
      {
        id: actionData.id,
        name: "grape-intake",
      },
    ],
    status: GrapeStatus.RECEIVED,
    metrics: { ...grape.metrics, actual: actionData.mass.net },
  });

  if (grapeRes.status === 200) {
    enqueueSnackbar("Grape updated", { variant: "success" });
  } else {
    enqueueSnackbar("Error updating grape", { variant: "error" });
  }
};

export const grapeProcessingAction = () => {};
