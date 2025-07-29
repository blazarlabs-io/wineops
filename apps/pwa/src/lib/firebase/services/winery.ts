

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as fdb } from '../client';
import { WINERY } from '../config';
import { DbResponse } from '@/models/types/db';

let winery: any = {};

winery = {
  getOne: async (id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          data: null,
          error: 'Winery not found',
          status: 404,
        };
      } else {
        return {
          data: docSnap.data(),
          error: null,
          status: 200,
        };
      }
    } catch (error) {
      return {
        data: null,
        error,
        status: 500,
      };
    }
  },
  create: async (id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, id);
      await setDoc(docRef, {});
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

export default winery;
