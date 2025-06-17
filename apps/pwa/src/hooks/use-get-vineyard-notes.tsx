import { db } from "@/lib/firebase/services";
import { DbResponse, Note, Vineyard } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetVineyardNotes = (
  uid: string,
  vineyard: Vineyard,
  notes: Note[]
) => {
  const [vineyardNotes, setVineyardNotes] = useState<Note[]>([]);

  useEffect(() => {
    // console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    // console.log("vineyard", vineyard);
    // console.log("notes", notes);
    // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n");

    if (
      vineyard &&
      vineyard !== undefined &&
      vineyard.notes &&
      vineyard.notes.length > 0
    ) {
      db.note
        .getVineyardNotes(
          uid,
          notes.map((note) => note.id)
        )
        .then((res: DbResponse) => {
          if (res.status === 200) {
            setVineyardNotes(res.data);
            console.log("vineyardNotes", vineyardNotes);
          } else {
            console.log("Error loading notes");
          }
        })
        .catch((error: DbResponse) => {
          console.log("error", error);
        });
    }
  }, [notes, uid, vineyard]);

  return { vineyardNotes };
};
