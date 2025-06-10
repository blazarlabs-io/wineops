import { collection, doc, getDocs } from "firebase/firestore";
import { db as fdb } from "../client";
import { TEAM, WINERY } from "../config";

const team = {
  getMembers: async (uid: string) => {
    console.log("UID", uid);
    try {
      const docRef = doc(fdb, WINERY, uid);
      const subcollectionRef = collection(docRef, TEAM);
      const docSnap = await getDocs(subcollectionRef);
      const data = docSnap.docs.map((doc) => doc.data());

      console.log("data", data);

      return {
        data: data,
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

export default team;
