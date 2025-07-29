import WorkspaceLayout from "@/components/layout/workspace-layout";
import type { Metadata } from "next";
import { StrictMode } from "react";

export const metadata: Metadata = {
  title: "WineOpSys",
  description: "Winery Operations Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WorkspaceLayout>
      <StrictMode>{children}</StrictMode>
    </WorkspaceLayout>
  );
}
