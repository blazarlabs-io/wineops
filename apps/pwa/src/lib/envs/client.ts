import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().trim().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().trim().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().trim().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().trim().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().trim().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().trim().min(1),
});

export const clientEnvs = (() => {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env
      .NEXT_PUBLIC_FIREBASE_API_KEY as string,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env
      .NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env
      .NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env
      .NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env
      .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env
      .NEXT_PUBLIC_FIREBASE_APP_ID as string,
  });

  if (!parsed.success) {
    throw new Error("Missing or invalid NEXT_PUBLIC_FIREBASE_ env vars");
  }

  return parsed.data;
})();
