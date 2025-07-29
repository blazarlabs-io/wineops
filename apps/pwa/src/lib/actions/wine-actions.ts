import { RowType } from "@/models/types/db";
import { db } from "../firebase/services";
import { enqueueSnackbar } from "notistack";
import {
  ActionRelation,
  BottleWineAction,
  Recipe,
} from "@/models/types/actions";

export const bottleWineAction = async (
  uid: string,
  actionData: BottleWineAction,
  recipe: Recipe
) => {

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  const {
    id,
    type,
    collectionName,
    vintage,
    executionDate,
    subjectRecipe,
    wines,
    ...otherData
  } = actionData;

  if (Array.isArray(wines)) {
    wines.map(async (wine) => {
      const wineRes = await db.wine.update(uid, wine.id, {
        actions: [
          ...(wine.actions || ([] as ActionRelation[])),
          {
            id,
            name: "bottle-a-wine",
          },
        ],
        qty: +(wine?.qty || 0) - (+wine?.quantity || 0),
      });

      if (wineRes.status === 200) {
        enqueueSnackbar("Wine updated", { variant: "success" });
      } else {
        enqueueSnackbar("Error updating wine", { variant: "error" });
      }
    });
  }

  const newId = crypto.randomUUID();

  const newCollection = {
    id: newId,
    name: collectionName,
    collectionName,
    vintage,
    executionDate,
    group: [collectionName],
    rowType: RowType.ITEM,
    wines,
    ...otherData,
  };

  const bottleRes = await db.bottle.create(uid, newCollection);

  if (bottleRes.status === 200) {
    enqueueSnackbar("Bottle collection created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating bottle collection", { variant: "error" });
  }
};
