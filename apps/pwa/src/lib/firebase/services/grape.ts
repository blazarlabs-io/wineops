import { DbResponse, Grape } from "@/models/types/db";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db as fdb } from "../client";
import { GRAPES, WINERY } from "../config";
import { cleanObject } from "@/utils/clean-object";
import { cleanObjectWithDeletes } from "@/utils/clean-objects-with-delete";

const grape = {
  create: async (id: string, data: Grape): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, GRAPES, data.id);
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
      const docRef = doc(fdb, WINERY, uid);
      const subcollectionRef = collection(docRef, GRAPES);
      const docSnap = await getDocs(subcollectionRef);
      const data = docSnap.docs.map((doc) => doc.data());
      const grapes = data.map((item) => item as Grape);
      const filteredData = grapes.find((item) => item.id === id);

      return {
        data: filteredData,
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

  update: async (uid: string, id: string, data: Grape): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, GRAPES, id);
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
  updateGroup: async (uid: string, rows: Grape[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(({ id, group, rowType }) => {
        const data: Partial<Grape> = {};

        if (group) data.group = group;
        if (rowType === "group") data.rowType = rowType;

        if (Object.keys(data).length === 0) return;

        const docRef = doc(fdb, WINERY, uid, GRAPES, id);

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
      const docRef = doc(fdb, WINERY, uid, GRAPES, id);
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
        const docRef = doc(fdb, WINERY, uid, GRAPES, id);

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

export default grape;
