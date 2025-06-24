"use client";

import { useAuth } from "@/lib/firebase/auth";
import { TEAM, WINERY } from "@/lib/firebase/config";
import { db as sdb } from "@/lib/firebase/services";
import { db } from "@/lib/firebase/client";

import {
  DbResponse,
  ResponsibleTeamMember,
  TeamMember,
  Winery,
} from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
// import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface WineryContextType {
  winery: Winery | null;
  teamMembers: TeamMember[];
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!user) {
      setWinery(null);
      return;
    }

    if (!mountRef.current) {
      mountRef.current = true;
      sdb.winery
        .getOne(user.uid)
        .then((res: DbResponse) => {
          if (res.status === 200 && res.error === null) {
            setWinery(res.data);
          } else {
            // * Create new winery
            sdb.winery
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

    const teamMembersRef = collection(db, WINERY, user?.uid as string, TEAM);

    let unsubTeamMembers = () => {};

    unsubTeamMembers = onSnapshot(teamMembersRef, (querySnapshot) => {
      const teamMembers: TeamMember[] = [];

      if (querySnapshot.empty) {
        console.log("No team members found");
        setTeamMembers([]);
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        teamMembers.push(data as TeamMember);
      });
      setTeamMembers(teamMembers);
    });

    return () => {
      unsubTeamMembers();
    };
  }, [user, winery]);

  return (
    <WineryContext.Provider
      value={{
        winery,
        teamMembers,
      }}
    >
      {children}
    </WineryContext.Provider>
  );
};
