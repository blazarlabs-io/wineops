import { TaskSummary } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useSortTasks = (data: TaskSummary[]) => {
  const [todoTasks, setTodoTasks] = useState<TaskSummary[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskSummary[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskSummary[]>([]);

  useEffect(() => {
    if (!Array.isArray(data)) return;

    setTodoTasks(data.filter((task) => task?.status === "todo"));
    setInProgressTasks(data.filter((task) => task?.status === "in-progress"));
    setCompletedTasks(data.filter((task) => task?.status === "completed"));
  }, [data]);

  return {
    todoTasks,
    inProgressTasks,
    completedTasks,
  };
};
