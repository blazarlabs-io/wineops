import { Note } from '@/models/types/db';

export type NotesDataDisplayProps = {
  notes: Note[];
};

export default function NotesDataDisplay({ notes }: NotesDataDisplayProps) {
  return (
    <div className="flex flex-col gap-2 items-start justify-center">
      {notes.length > 0 && (
        <>
          {notes.map((note, index) => (
            <div key={note.id} className="flex flex-col items-start justify-center gap-2">
              {index < 1 ? (
                <div className="flex relative flex-col items-start justify-start rounded-md border max-w-fit p-1">
                  <div className="absolute top-0 left-0 w-[4px] h-full bg-[#00C950] rounded-l-md" />
                  <p className="pl-2 text-sm truncate max-w-[140px]">{note.title}</p>
                  <p className="pl-2 text-xs text-muted-foreground truncate max-w-[140px]">
                    {note.content}
                  </p>
                </div>
              ) : (
                <>
                  {index === 1 && (
                    <button className="text-xs text-muted-foreground underline">
                      + {notes.length - 1} more
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
