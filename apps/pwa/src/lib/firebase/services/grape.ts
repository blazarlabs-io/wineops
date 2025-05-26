import { DbResponse, Grape } from "@/models/types/db";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { GRAPES, WINERY } from "../config";

const grape = {
  create: async (uid: string, data: Grape): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, GRAPES, data.id);
      const newDocRef = await setDoc(docRef, data);

      return {
        data: newDocRef,
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  updateGroup: async (uid: string, rows: Grape[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(async ({ id, group }) => {
        if (!group) return;

        const docRef = doc(fdb, WINERY, uid, GRAPES, id);
        batch.update(docRef, { group });
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
