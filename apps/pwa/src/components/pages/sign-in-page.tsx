"use client";

import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage as SignInPageTemplate } from "@toolpad/core/SignInPage";

export default function SignInPage() {
  return (
    <AppProvider>
      <SignInPageTemplate
        providers={[{ id: "email", name: "Email" }]}
        signIn={async (provider) => {
          // Your sign in logic
        }}
      />
    </AppProvider>
  );
}
