"use client";
import Topbar from "@/components/navigation/topbar";
import { mainTheme } from "@/lib/themes/main-theme";
import { Box } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider theme={mainTheme}>
      <Box
        sx={{ width: "100%", height: "100vh" }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        flexDirection={"column"}
      >
        <Topbar />
        <main className="flex w-full h-full items-center justify-center">
          {children}
        </main>
      </Box>
    </AppProvider>
  );
}
