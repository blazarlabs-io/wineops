import { DbResponse, Grape } from "@/models/types/db";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { GRAPES, WINERY } from "../config";

const grape = {
  updateGroup: async (uid: string, rows: Grape[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(({ id, group, rowType }) => {
        const data: Partial<Grape> = {};

        if (group) data.group = group;
        if (rowType === "group") data.rowType = rowType;

        if (Object.keys(data).length === 0) return;

        const docRef = doc(fdb, WINERY, uid, GRAPES, id);

        // Empty groups
        if (rowType === "group" && (!group || group.length === 0)) {
          batch.delete(docRef);
        } else {
          batch.set(docRef, data, { merge: true });
        }
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
  deleteOne: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, GRAPES, id);
      await deleteDoc(docRef);
      return {
        data: null,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log("error", error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
};

export default grape;
