import { db } from "@/lib/firebase/services";
import { DbResponse, Note, Vineyard } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetVineyardNotes = (
  uid: string,
  vineyard: Vineyard,
  notes: Note[]
) => {
  const [vineyardNotes, setVineyardNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    if (
      vineyard &&
      vineyard !== undefined &&
      vineyard.notes &&
      vineyard.notes.length > 0
    ) {
      const vineyardNoteIds = new Set(vineyard.notes?.map((vn) => vn.id));
      const matchedNotes = notes.filter((note) => vineyardNoteIds.has(note.id));

      db.note
        .getVineyardNotes(uid, matchedNotes)
        .then((res: DbResponse) => {
          if (res.status === 200) {
            setVineyardNotes(res.data);
            setVineyardNotes(res.data.reverse());
          } else {
          }
        })
        .catch((error: DbResponse) => {
        });
    }
  }, [notes, uid, vineyard]);

  return { vineyardNotes };
};
