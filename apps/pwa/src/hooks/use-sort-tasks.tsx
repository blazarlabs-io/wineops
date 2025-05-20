import { Task } from "@/models/types/db";
import { IRowNode } from "ag-grid-community";
import { useEffect, useRef, useState } from "react";

export const useSortTasks = (data: IRowNode[]) => {
  const mountRef = useRef<boolean>(false);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    // console.log("data", data);

    if (!mountRef.current && data && data !== undefined && data.length > 0) {
      mountRef.current = true;
      if (data.length <= 1) {
        setTodoTasks(
          data[0].data.tasks.filter((task: Task) => task.status === "todo")
        );
        setInProgressTasks(
          data[0].data.tasks.filter(
            (task: Task) => task.status === "in-progress"
          )
        );
        setCompletedTasks(
          data[0].data.tasks.filter((task: Task) => task.status === "completed")
        );
      } else {
        data.forEach((vineyard) => {
          vineyard.data.tasks.forEach((task: Task) => {
            switch (task.status) {
              case "todo":
                setTodoTasks((prev) => [...prev, task]);
                break;
              case "in-progress":
                setInProgressTasks((prev) => [...prev, task]);
                break;
              case "completed":
                setCompletedTasks((prev) => [...prev, task]);
                break;
              default:
                break;
            }
          });
        });
      }
    }
  }, [data]);

  return {
    todoTasks,
    inProgressTasks,
    completedTasks,
  };
};
