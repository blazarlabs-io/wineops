import { DbResponse, TeamMember } from "@/models/types/db";
import { cleanUndefined } from "@/utils/clean-undefined";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
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
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  getMembers: async (uid: string) => {
    try {
      const docRef = doc(fdb, WINERY, uid);
      const subcollectionRef = collection(docRef, TEAM);
      const docSnap = await getDocs(subcollectionRef);
      const data = docSnap.docs.map((doc) => doc.data());

      return {
        data: data,
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
  update: async (uid: string, data: TeamMember): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, TEAM, data.id);

      await setDoc(docRef, data, { merge: true });

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
  deleteMany: async (uid: string, rows: string[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach((id) => {
        const docRef = doc(fdb, WINERY, uid, TEAM, id);
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

export default team;
