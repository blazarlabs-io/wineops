import { DbResponse, LabReport } from "@/models/types/db";
import { cleanUndefined } from "@/utils/clean-undefined";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db as fdb } from "../../firebase/client";
import { LAB_REPORTS, WINERY } from "../config";

const labReport = {
  create: async (uid: string, data: LabReport) => {
    try {
      const docRef = doc(fdb, WINERY, uid, LAB_REPORTS, data.id);
      const cleanedData = cleanUndefined(data);
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
  getAll: async (uid: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid);
      const subcollectionRef = collection(docRef, LAB_REPORTS);
      const querySnapshot = await getDocs(subcollectionRef);
      const data = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data };
      });

      return {
        data,
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

export default labReport;
