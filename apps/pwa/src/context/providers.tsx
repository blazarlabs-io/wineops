"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { SnackbarProvider } from "notistack";
import { SidebarProvider } from "./sidebar";
import { VineyardProvider } from "./vineyard";
import { WineryProvider } from "./winery";
import { GrapeProvider } from "./grape";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { VesselProvider } from "./vessel";
import { ConsumableProvider } from "./consumable";
import { MustProvider } from "./must";
import { ChemistryProvider } from "./chemistry";
import { BulkProvider } from "./bulk";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider>
      <SidebarProvider>
        <WineryProvider>
          <VineyardProvider>
            <GrapeProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <VesselProvider>
                  <ConsumableProvider>
                    <MustProvider>
                      <ChemistryProvider>
                        <BulkProvider>
                          <APIProvider
                            apiKey={
                              process.env
                                .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
                            }
                          >
                            {children}
                          </APIProvider>
                        </BulkProvider>
                      </ChemistryProvider>
                    </MustProvider>
                  </ConsumableProvider>
                </VesselProvider>
              </LocalizationProvider>
            </GrapeProvider>
          </VineyardProvider>
        </WineryProvider>
      </SidebarProvider>
    </SnackbarProvider>
  );
}
