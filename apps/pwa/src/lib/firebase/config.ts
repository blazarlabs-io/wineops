import { clientEnvs } from "../envs/client";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: clientEnvs.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: clientEnvs.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: clientEnvs.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: clientEnvs.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId:
    clientEnvs.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: clientEnvs.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};
export const WINERY = "winery";
export const VINEYARDS = "vineyards";
export const VINEYARDS_GROUPS = "vineyards_groups";
export const GRAPES = "grapes";
export const MUST = "must";
export const BULKWINES = "bulkwines";
export const VESSELS = "vessels";
