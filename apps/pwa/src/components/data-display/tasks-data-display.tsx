import { Task, TaskSummary } from "@/models/types/db";
import { CalendarX, Calendar, CalendarClock } from "lucide-react";

export type TasksDataDisplayProps = {
  todo: TaskSummary[];
  inProgress: TaskSummary[];
  completed: TaskSummary[];
};

export default function TasksDataDisplay({
  todo,
  inProgress,
  completed,
}: TasksDataDisplayProps) {
  return (
    <div className="flex flex-col h-full items-start justify-center">
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <CalendarX className="w-4 h-4 text-[#FF7878]" />
        <span className="max-h-fit">{`${todo.length} to do`}</span>
      </button>
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <Calendar className="w-4 h-4 text-[#FFAE52]" />
        <span className="max-h-fit">{`${inProgress.length} in progress`}</span>
      </button>
      <button className="flex items-center gap-1 cursor-pointer max-h-[24px]">
        <CalendarClock className="w-4 h-4 text-[#00C950]" />
        <span className="max-h-fit">{`${completed.length} completed`}</span>
      </button>
    </div>
  );
}
