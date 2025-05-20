import { GROUP_ITEMS_TO_SHOW } from "@/data/constants";
import { Note } from "@/models/types/db";

export type NotesDataDisplayProps = {
  notes: Note[];
};

export default function NotesDataDisplay({ notes }: NotesDataDisplayProps) {
  return (
    <div className="flex flex-col gap-2 items-start justify-center">
      {notes.length > 0 && (
        <>
          {notes.map(({ id, title }, index) => (
            <div
              key={id ?? index}
              className="flex flex-col items-start justify-center gap-2"
            >
              {index < GROUP_ITEMS_TO_SHOW ? (
                <div className="flex relative flex-col items-start justify-start rounded-md border max-w-fit p-1">
                  <div className="absolute top-0 left-0 w-[4px] h-full bg-[#00C950] rounded-l-md" />
                  <p className="pl-2 text-sm truncate max-w-[140px]">{title}</p>
                </div>
              ) : (
                <>
                  {index === GROUP_ITEMS_TO_SHOW && (
                    <button className="text-xs text-muted-foreground underline">
                      + {notes.length - GROUP_ITEMS_TO_SHOW} more
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
