/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, setDoc } from "firebase/firestore";
import { db } from "../client";
import { ACTIONS, WINERY } from "../config";
import { cleanUndefined } from "@/utils/clean-undefined";

const action = {
  create: async (uid: string, data: any) => {
    try {
      const docRef = doc(db, WINERY, uid, ACTIONS, data.id);
      const cleanedData = cleanUndefined(data);
      console.log("\n\ncleanedData", cleanedData);
      const newDocRef = await setDoc(docRef, cleanedData);

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

export default action;
