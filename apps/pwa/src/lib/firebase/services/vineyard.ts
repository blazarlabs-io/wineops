/* eslint-disable @typescript-eslint/no-explicit-any */
import { DbResponse, Group, Vineyard } from '@/models/types/db';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db as fdb } from '../client';
import { VINEYARDS, VINEYARDS_GROUPS, WINERY } from '../config';

let vineyard: any = {};

vineyard = {
  create: async (id: string, data: Vineyard): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, VINEYARDS, data.id);
      const newDocRef = await setDoc(docRef, data);

      return {
        data: newDocRef,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  getAll: async (id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id);
      const subcollectionRef = collection(docRef, VINEYARDS);
      const querySnapshot = await getDocs(subcollectionRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      return {
        data,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
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
      const subcollectionRef = collection(docRef, VINEYARDS);
      const docSnap = await getDocs(subcollectionRef);
      const data = docSnap.docs.map((doc) => doc.data());
      const vineyards = data.map((item) => item as Vineyard);
      const filteredData = vineyards.filter((item) => item.id === id);
      return {
        data: filteredData[0],
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  update: async (uid: string, id: string, data: Vineyard): Promise<DbResponse> => {
    try {
      console.log('uid', uid, 'id', id, 'data', data);
      const docRef = doc(fdb, WINERY, uid, VINEYARDS, id);
      await updateDoc(docRef, data);
      return {
        data: null,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  deleteOne: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, VINEYARDS, id);
      await deleteDoc(docRef);
      return {
        data: null,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  getAllGroups: async (id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id);
      const subcollectionRef = collection(docRef, VINEYARDS_GROUPS);
      const querySnapshot = await getDocs(subcollectionRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      return {
        data,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  createGroup: async (id: string, data: Group): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id, VINEYARDS_GROUPS, data.id);
      await setDoc(docRef, data);
      return {
        data: null,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log('error', error);
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
};

export default vineyard;
