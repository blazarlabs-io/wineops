"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { VineyardProvider } from "./vineyard";
import { WineryProvider } from "./winery";
import { SnackbarProvider } from "notistack";
import { SidebarProvider } from "./sidebar";
import { GrapeProvider } from "./grape";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider>
      <SidebarProvider>
        <WineryProvider>
          <VineyardProvider>
            <GrapeProvider>
              <APIProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
              >
                {children}
              </APIProvider>
            </GrapeProvider>
          </VineyardProvider>
        </WineryProvider>
      </SidebarProvider>
    </SnackbarProvider>
  );
}
