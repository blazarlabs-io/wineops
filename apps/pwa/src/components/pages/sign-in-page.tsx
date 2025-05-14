/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth } from "@/lib/firebase/client";
import { mainTheme } from "@/lib/themes/main-theme";
import {
  SignInPage as SignInPageComponent,
  type AuthProvider,
} from "@toolpad/core/SignInPage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";

export default function SignInPage() {
  const { signIn: fbSignIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const signIn = async (
    provider: AuthProvider,
    formData: FormData,
    callbackUrl?: string
  ) => {
    try {
      const res: any = await fbSignIn(
        formData.get("email") as string,
        formData.get("password") as string
      );

      console.log(res);

      if (res.code === 200) {
        enqueueSnackbar("Sign in successful", { variant: "success" });
      } else {
        enqueueSnackbar("Sign in failed", { variant: "error" });
      }

      return res;
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Sign in failed", { variant: "error" });
      return null;
    }
  };

  return (
    <SignInPageComponent
      providers={[
        { id: "credentials", name: "Email and Password" },
        { id: "google", name: "Google" },
      ]}
      signIn={async (
        provider: AuthProvider,
        formData: FormData,
        callbackUrl?: string
      ) => {
        try {
          return await signIn(provider, formData);
        } catch (error: typeof Error | any) {
          return error;
        }
      }}
    />
  );
}
