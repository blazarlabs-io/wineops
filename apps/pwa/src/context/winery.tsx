"use client";

import { useAuth } from "@/lib/firebase/auth";
import { DOCUMENTS, LAB_REPORTS, TEAM, WINERY } from "@/lib/firebase/config";
import { db as sdb } from "@/lib/firebase/services";
import { db } from "@/lib/firebase/client";

import {
  DbResponse,
  ResponsibleTeamMember,
  TeamMember,
  Winery,
} from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface WineryContextType {
  winery: Winery | null;
  teamMembers: TeamMember[];
  documents: any[];
}

const WineryContext = createContext<WineryContextType | null>(null);

export const useWinery = () => {
  const context = useContext(WineryContext);

  if (!context) {
    throw new Error(`'useWinery' was used outside of VineyardProvider`);
  }

  return context;
};

export const WineryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const mountRef = useRef<boolean>(false);
  const [winery, setWinery] = useState<Winery | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

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
            sdb.winery
              .create(user.uid)
              .then((res: DbResponse) => {
                if (res.status === 200) {
                  setWinery({
                    ...(winery as Winery),
                    name: "",
                    id: user.uid,
                  });
                } else {
                  setWinery(null);
                }
              })
              .catch((err: DbResponse) => {
                setWinery(null);
              });
          }
        })
        .catch((err: DbResponse) => {
          setWinery(null);
        });
    }

    const teamMembersRef = collection(db, WINERY, user?.uid as string, TEAM);
    const documentsRef = collection(db, WINERY, user?.uid as string, DOCUMENTS);

    let unsubTeamMembers = () => {};
    let unsubDocuments = () => {};

    unsubDocuments = onSnapshot(documentsRef, async (querySnapshot) => {
      const documents: any[] = [];

      const labReportRes = await sdb.labReport.getAll(user?.uid as string);

      if (labReportRes.status === 200) {
        labReportRes.data.forEach((report: any) => {
          if (
            report.supportingDocuments &&
            report.supportingDocuments.length > 0
          ) {
            report.supportingDocuments.forEach((doc: any) => {
              documents.push(doc);
            });
          }
        });
      }

      if (querySnapshot.empty) {
        setDocuments([]);
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push(data);
      });

      setDocuments(documents);
    });

    unsubTeamMembers = onSnapshot(teamMembersRef, (querySnapshot) => {
      const teamMembers: TeamMember[] = [];

      if (querySnapshot.empty) {
        setTeamMembers([]);
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        teamMembers.push(data as TeamMember);
      });
      setTeamMembers(teamMembers);
    });

    return () => {
      unsubTeamMembers();
      unsubDocuments();
    };
  }, [user, winery]);

  return (
    <WineryContext.Provider
      value={{
        winery,
        teamMembers,
        documents,
      }}
    >
      {children}
    </WineryContext.Provider>
  );
};
