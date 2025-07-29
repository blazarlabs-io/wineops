import { DbResponse } from "@/models/types/db";
import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { ANEXA14, WINERY } from "../config";
import { cleanObject } from "@/utils/clean-object";
import { Anexa14Data } from "@/models/types/reports";

const anexa14 = {
  create: async (id: string, data: Anexa14Data): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, ANEXA14, data.id);
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
  getOne: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, ANEXA14, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          data: null,
          error: "Data not found",
          status: 404,
        };
      }

      const data = docSnap.data() as Anexa14Data;

      return {
        data,
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
  update: async (
    uid: string,
    id: string,
    data: Anexa14Data,
  ): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, ANEXA14, id);

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
  deleteOne: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, ANEXA14, id);
      await deleteDoc(docRef);

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
        const docRef = doc(fdb, WINERY, uid, ANEXA14, id);

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

export default anexa14;
