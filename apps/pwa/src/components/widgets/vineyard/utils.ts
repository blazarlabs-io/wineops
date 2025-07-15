/* eslint-disable @typescript-eslint/no-explicit-any */

import { db as dbClients } from "@/lib/firebase/client";
import { ACTIONS, WINERY } from "@/lib/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getActionsByIds(
  actionIds: string[],
  uid: string
): Promise<any[]> {
  if (actionIds.length === 0) return [];

  const chunks = chunkArray(actionIds, 10);

  const queries = chunks.map((idChunk) => {
    const actionsRef = collection(dbClients, WINERY, uid, ACTIONS);
    return query(actionsRef, where("__name__", "in", idChunk));
  });

  const results = await Promise.all(queries.map((q) => getDocs(q)));

  const actions = results.flatMap((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  );

  return actions;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
