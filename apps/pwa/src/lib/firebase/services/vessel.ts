import { DbResponse, Vessel } from "@/models/types/db";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db as fdb } from "../client";
import { VESSELS, WINERY } from "../config";
import { cleanObject } from "@/utils/clean-object";
import { cleanObjectWithDeletes } from "@/utils/clean-objects-with-delete";

const vessel = {
  create: async (id: string, data: Vessel): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, VESSELS, data.id);
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
      const subcollectionRef = collection(docRef, VESSELS);
      const docSnap = await getDocs(subcollectionRef);
      const data = docSnap.docs.map((doc) => doc.data());
      const vessels = data.map((item) => item as Vessel);
      const filteredData = vessels.find((item) => item.id === id);

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
  update: async (
    uid: string,
    id: string,
    data: Vessel
  ): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, VESSELS, id);
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
  updateGroup: async (uid: string, rows: Vessel[]) => {
    try {
      const batch = writeBatch(fdb);

      rows.forEach(({ id, group, rowType }) => {
        const data: Partial<Vessel> = {};

        if (group) data.group = group;
        if (rowType === "group") data.rowType = rowType;

        if (Object.keys(data).length === 0) return;

        const docRef = doc(fdb, WINERY, uid, VESSELS, id);

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
      const docRef = doc(fdb, WINERY, uid, VESSELS, id);
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
        const docRef = doc(fdb, WINERY, uid, VESSELS, id);

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

export default vessel;
