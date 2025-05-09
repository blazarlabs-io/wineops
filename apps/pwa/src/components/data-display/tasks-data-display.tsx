import { CalendarX, Calendar, CalendarClock } from 'lucide-react';

export default function TasksDataDisplay() {
  return (
    <div className="flex flex-col h-full items-start justify-center">
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <CalendarX className="w-4 h-4 text-[#FF7878]" />
        <span className="underline max-h-fit">10 overdue</span>
      </button>
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <Calendar className="w-4 h-4 text-[#FFAE52]" />
        <span className="underline max-h-fit">3 not started</span>
      </button>
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <CalendarClock className="w-4 h-4 text-[#00C950]" />
        <span className="underline max-h-fit">7 ongoing</span>
      </button>
    </div>
  );
}
