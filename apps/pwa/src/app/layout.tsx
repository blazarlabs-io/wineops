
import Providers from "@/context/providers";
import { AuthProvider } from "@/lib/firebase/auth";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { User } from "firebase/auth";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WineOpSys",
  description: "Winery Operations Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AuthProvider serverUser={currentUser?.toJSON() as User | null}>
            <Providers>{children}</Providers>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
