import { DbResponse, Chemistry } from "@/models/types/db";
import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db as fdb } from "../client";
import { CHEMISTRY, WINERY } from "../config";
import { cleanObject } from "@/utils/clean-object";

const chemistry = {
  create: async (id: string, data: Chemistry): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, CHEMISTRY, data.id);
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
      const docRef = doc(fdb, WINERY, uid, CHEMISTRY, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          data: null,
          error: "Chemistry not found",
          status: 404,
        };
      }

      const data = docSnap.data() as Chemistry;

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
    data: Chemistry
  ): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, CHEMISTRY, id);

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
  updateGroup: async (uid: string, rows: Chemistry[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(({ id, group, rowType }) => {
        const data: Partial<Chemistry> = {};

        if (group) data.group = group;
        if (rowType === "group") data.rowType = rowType;

        if (Object.keys(data).length === 0) return;

        const docRef = doc(fdb, WINERY, uid, CHEMISTRY, id);

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

      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  deleteOne: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, CHEMISTRY, id);
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
        const docRef = doc(fdb, WINERY, uid, CHEMISTRY, id);

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

export default chemistry;
