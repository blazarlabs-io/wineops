"use client";

import {
  createUserWithEmailAndPassword,
  confirmPasswordReset as fConfirmPasswordReset,
  sendPasswordResetEmail as fSendPasswordResetEmail,
  signOut as fSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./client";
import { firebaseConfig } from "./config";

interface IAuthContext {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  confirmPasswordReset: (password: string, oobCode: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(`'useAuth' was used outside of AuthProvider`);
  }

  return context;
};

interface IAuthProvider {
  serverUser: User | null;
  children: React.ReactNode;
}

export const AuthProvider = ({ serverUser, children }: IAuthProvider) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(serverUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => {})
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (user === undefined) return;

      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      if (window !== undefined) {
        window.location.href = "/workspace/wine-production/vineyards";
      }
      return res.user;
    } catch (error) {
      return null;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await fSignOut(auth);
  };

  const sendPasswordResetEmail = async (email: string) => {
    await fSendPasswordResetEmail(auth, email);
  };

  const confirmPasswordReset = async (password: string, oobCode: string) => {
    await fConfirmPasswordReset(auth, oobCode, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        sendPasswordResetEmail,
        confirmPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
