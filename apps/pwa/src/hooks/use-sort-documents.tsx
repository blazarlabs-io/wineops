/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

export type DocumentType = {
  id: string;
  name: string;
  type: string;
  date: string;
  ownerNameAndEmail: string;
};

export const useSortDocuments = (docs: any) => {
  const [sortedDocs, setSortedDocs] = useState<DocumentType[]>([]);
  const mountRef = useRef<boolean>(false);

  useEffect(() => {
    if (docs && docs.length > 0 && !mountRef.current) {
      mountRef.current = true;
      docs.map((doc: any, index: number) => {
        console.log(index);
        const name = doc.name; //.split(".").slice(0, -1).join(".");
        const newDoc: DocumentType = {
          id: Date.now().toString(),
          name,
          type: doc.type,
          date: doc.date.toDate().toDateString(),
          ownerNameAndEmail: doc.responsible.name,
        };
        console.log("newDoc", newDoc);
        // * if new doc exists in sortedDocs return
        setSortedDocs((prev: any) => [...prev, newDoc]);
      });
    }
  }, [docs]);
  return { sortedDocs };
};
