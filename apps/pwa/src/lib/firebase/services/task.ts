import { DbResponse, Note, Task, TeamMember } from "@/models/types/db";
import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { NOTES, TASKS, WINERY } from "../config";

const task = {
  create: async (uid: string, data: Task): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, TASKS, data.id);
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
  deleteMany: async (uid: string, rows: string[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach((id) => {
        const docRef = doc(fdb, WINERY, uid, TASKS, id);
        batch.delete(docRef);
      });

      await batch.commit();

      return {
        data: null,
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
};

export default task;
