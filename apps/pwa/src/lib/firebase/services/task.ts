import { DbResponse, Note, Task, TeamMember } from "@/models/types/db";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
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
      console.log("error", error);

      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
};

export default task;
