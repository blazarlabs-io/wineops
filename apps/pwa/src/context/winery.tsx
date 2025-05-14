"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { DbResponse, Winery } from "@/models/types/db";
// import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface WineryContextType {
  winery: Winery | null;
}

const WineryContext = createContext<WineryContextType | null>(null);

// hook that we can use anywhere in the app
export const useWinery = () => {
  const context = useContext(WineryContext);

  if (!context) {
    throw new Error(`'useWinery' was used outside of VineyardProvider`);
  }

  return context;
};

export const WineryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  // const { enqueueSnackbar } = useSnackbar();
  const mountRef = useRef<boolean>(false);
  const [winery, setWinery] = useState<Winery | null>(null);

  useEffect(() => {
    if (!user) {
      setWinery(null);
      return;
    }

    if (!mountRef.current) {
      mountRef.current = true;
      db.winery
        .getOne(user.uid)
        .then((res: DbResponse) => {
          if (res.status === 200 && res.error === null) {
            setWinery(res.data);
          } else {
            // * Create new winery
            db.winery
              .create(user.uid)
              .then((res: DbResponse) => {
                if (res.status === 200) {
                  setWinery({
                    ...(winery as Winery),
                    name: "",
                    id: user.uid,
                  });
                  // enqueueSnackbar("winery created", { variant: "success" });
                } else {
                  setWinery(null);
                  // enqueueSnackbar("Error creating winery", {
                  //   variant: "error",
                  // });
                }
              })
              .catch((err: DbResponse) => {
                console.log("err", err);
                setWinery(null);
                // enqueueSnackbar("Error creating winery", { variant: "error" });
              });
          }
        })
        .catch((err: DbResponse) => {
          console.log("err", err);
          setWinery(null);
          // enqueueSnackbar("Error creating winery", { variant: "error" });
        });
    }
  }, [user]);

  return (
    <WineryContext.Provider value={{ winery }}>
      {children}
    </WineryContext.Provider>
  );
};
