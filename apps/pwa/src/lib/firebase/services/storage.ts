import { DbResponse } from "@/models/types/db";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const storage: any = {
  uploadFile: (
    file: File,
    uid: string,
    path: string,
    onProgress: (progress: number) => void,
    onComplete: (downloadUrl: string) => void,
    onError: (error: Error) => void,
  ) => {
    try {
      if (!file) {
        onError(new Error("Only files are allowed"));
        return;
      }

      const fullPath = `${uid}/${path}/${file.name}`;

      const storage = getStorage(); // assumes firebase app is already initialized
      const storageRef = ref(storage, fullPath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          onError(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onComplete(downloadUrl);
          } catch (err) {
            onError(err as Error);
          }
        },
      );
    } catch (error) {
      onError(error as Error);
    }
  },
  deleteFile: async (
    uid: string,
    path: string,
    fileName: string,
  ): Promise<DbResponse> => {
    try {
      const storage = getStorage(); // assumes firebase app is already initialized
      const storageRef = ref(storage, `${uid}/${path}/${fileName}`);
      await deleteObject(storageRef);
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

export default storage;
