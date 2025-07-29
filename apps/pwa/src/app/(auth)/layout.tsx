import PublicLayout from "@/components/layout/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WineOpSys",
  description: "Winery Operations Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicLayout>{children}</PublicLayout>;
}
