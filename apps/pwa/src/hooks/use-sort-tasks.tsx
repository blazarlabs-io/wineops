import { TaskSummary } from "@/models/types/db";
import { useEffect, useRef, useState } from "react";

export const useSortTasks = (data: TaskSummary[]) => {
  const mountRef = useRef<boolean>(false);
  const [todoTasks, setTodoTasks] = useState<TaskSummary[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskSummary[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskSummary[]>([]);

  useEffect(() => {
    if (!mountRef.current && data && data !== undefined && data.length > 0) {
      mountRef.current = true;
      setTodoTasks(data.filter((task: TaskSummary) => task?.status === "todo"));
      setInProgressTasks(
        data.filter((task: TaskSummary) => task?.status === "in-progress")
      );
      setCompletedTasks(
        data.filter((task: TaskSummary) => task?.status === "completed")
      );
    }
  }, [data]);

  return {
    todoTasks,
    inProgressTasks,
    completedTasks,
  };
};
