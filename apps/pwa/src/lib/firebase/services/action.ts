
import { doc, setDoc } from "firebase/firestore";
import { db } from "../client";
import { ACTIONS, WINERY } from "../config";
import { DbResponse } from "@/models/types/db";
import { cleanObjectWithDeletes } from "@/utils/clean-objects-with-delete";
import { cleanObject } from "@/utils/clean-object";

const action = {
  create: async (uid: string, data: any) => {
    try {
      const docRef = doc(db, WINERY, uid, ACTIONS, data.id);
      const cleanedData = cleanObject(data);
      const newDocRef = await setDoc(docRef, cleanedData);

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
  update: async (uid: string, id: string, data: any): Promise<DbResponse> => {
    try {
      const docRef = doc(db, WINERY, uid, ACTIONS, id);
      const cleanedData = cleanObjectWithDeletes(data);

      await setDoc(docRef, cleanedData, { merge: true });

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

export default action;
