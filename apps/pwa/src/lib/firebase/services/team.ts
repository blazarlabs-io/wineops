import { TeamMember } from "@/models/types/db";
import { cleanUndefined } from "@/utils/clean-undefined";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db as fdb } from "../client";
import { TEAM, WINERY } from "../config";

const team = {
  create: async (uid: string, data: TeamMember) => {
    try {
      const docRef = doc(fdb, WINERY, uid, TEAM, data.id);
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
