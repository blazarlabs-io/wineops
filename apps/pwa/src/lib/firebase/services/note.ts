import { DbResponse, Note, TeamMember } from "@/models/types/db";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db as fdb } from "../client";
import { NOTES, WINERY } from "../config";

const note = {
  create: async (uid: string, data: TeamMember) => {
    try {
      const docRef = doc(fdb, WINERY, uid, NOTES, data.id);
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
  getVineyardNotes: async (uid: string, notes: Note[]): Promise<DbResponse> => {
    try {
      const notesData = notes.map(async ({ id }) => {
        const docRef = doc(fdb, WINERY, uid, NOTES, id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
      });

      const data = await Promise.all(notesData);

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
  update: async (uid: string, data: Note): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, NOTES, data.id);

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
  delete: async (uid: string, id: string): Promise<DbResponse> => {
    try {
      const docRef = doc(fdb, WINERY, uid, NOTES, id);
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
};

export default note;
