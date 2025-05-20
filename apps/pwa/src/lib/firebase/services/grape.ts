import { Grape } from "@/models/types/db";
import { doc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { GRAPES, WINERY } from "../config";

const grape = {
  updateGroup: async (uid: string, rows: Grape[], group: string[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(async ({ id, name }) => {
        const docRef = doc(fdb, WINERY, uid, GRAPES, id);
        batch.update(docRef, { group: [...group, name] });
      });

      await batch.commit();

      return {
        data: null,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.error("Error updating group:", error);

      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
};

export default grape;
