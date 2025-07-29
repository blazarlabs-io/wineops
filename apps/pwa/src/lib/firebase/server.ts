import { type FirebaseApp, initializeServerApp } from "firebase/app";
import { getAuth, type User } from "firebase/auth";
import { headers } from "next/headers";
import { firebaseConfig } from "./config";

export const getAuthenticatedAppForUser = async (): Promise<{
  firebaseServerApp: FirebaseApp;
  currentUser: User | null;
}> => {
  const authIdToken = (await headers())
    .get("Authorization")
    ?.split("Bearer ")[1];
  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    authIdToken ? { authIdToken } : {},
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
};
