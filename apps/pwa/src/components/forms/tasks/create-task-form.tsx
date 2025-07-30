"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Priority, Task, TaskStatus, TeamMember } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { createTaskSchema } from "@/models/schemas/create-task-schema";
import { parseToDate } from "@/utils/date-format";
import {
  Box,
  Button,
  FormControl,
  TextField as Input,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type CreateTaskFormProps = {
  teamMembers: TeamMember[];
  uid: string;
  onDataSubmit: (data: any) => void;
  onClose: () => void;
};

export default function CreateTaskForm({
  teamMembers,
  uid,
  onDataSubmit,
  onClose,
}: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createTaskSchema),
  });

  const [formData, setFormData] = useState<Task | null>(null);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setFormData((prev) => ({
        ...(prev as Task),
        [name]: value,
      }));
      setValue(name, value);
    },
    [setValue],
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    onDataSubmit(data);
    setFormData(data);
  };

  useEffect(() => {
    if (teamMembers) {
      const member = teamMembers.filter((v) => v.id === uid)[0];
      const newTask: Task = {
        id: Date.now().toString(),
        title: "",
        description: "",
        startDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        assignedTo: member,
        createdBy: member,
        status: TaskStatus.NEW,
        duration: 0,
      };
      reset(newTask);
      setFormData(newTask);
    }
  }, [teamMembers]);

  useEffect(() => {
    if (errors) {
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="w-full py-4">
            <div className="flex flex-col gap-4 w-full">

              <div className="hidden">
                <FormControl>
                  <Input
                    id={formData.id as VineyardGlobalAction["id"]}
                    value={formData.id}
                    type="hidden"
                    {...register("id")}
                  />
                </FormControl>
              </div>

              <div className="flex flex-col w-full">
                <Box display={"flex"} flexDirection={"column"} gap={2}>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        {...register("title")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextareaAutosize
                        aria-label="description"
                        placeholder="Describe your task..."
                        minRows={3}
                        {...register("description")}
                        style={{
                          width: "100%",
                          borderColor: "var(--mui-palette-divider)",
                        }}
                        className="border-2 rounded-md p-2"
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <InputLabel id="assignedTo.name">Assigned To</InputLabel>
                      <Select
                        id="assignedTo.name"
                        name="assignedTo.name"
                        defaultValue=""
                        labelId="assignedTo.name"
                        label="Assigned To"
                        variant="outlined"
                        value={(formData?.assignedTo?.name as string) || ""}
                        onChange={(e) => {
                          const member = teamMembers.filter(
                            (v) => v.id === e.target.value,
                          )[0];

                          handleChange("assignedTo.name", member.name);
                          handleChange("assignedTo.lastName", member.lastName);
                          handleChange("assignedTo.email", member.email);
                          handleChange("assignedTo.role", member.role);
                          handleChange("assignedTo.avatar", member.avatar);
                          handleChange(
                            "assignedTo.department",
                            member.department,
                          );
                          handleChange(
                            "assignedTo.contactPhone",
                            member.contactPhone,
                          );
                        }}
                      >
                        {teamMembers.map((member, index) => (
                          <MenuItem key={member.id + index} value={member.id}>
                            {`${member.name} ${member.lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="duration"
                        label="Duration"
                        variant="outlined"
                        {...register("duration")}
                      />
                    </FormControl>
                  </div>

                  <Typography variant="body1">Subject of Action</Typography>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="dashboard"
                        label="Dashboard"
                        variant="outlined"
                        {...register("subjectOfAction.dashboard")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="object"
                        label="Object"
                        variant="outlined"
                        {...register("subjectOfAction.object")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <InputLabel id="assignedTo">Priority</InputLabel>
                      <Select
                        id="priority"
                        labelId="priority"
                        label="Priority"
                        variant="outlined"
                        {...register("priority")}
                      >
                        {Object.values(Priority).map((p, index) => (
                          <MenuItem key={p + index} value={p}>
                            {p}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-2">
                    <DatePicker
                      label="Start Date"
                      value={
                        formData?.startDate
                          ? dayjs(parseToDate(formData?.startDate))
                          : null
                      }
                      onChange={(newValue) =>
                        handleChange(
                          "startDate",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : null,
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <DatePicker
                      label="Due Date"
                      value={
                        formData?.dueDate
                          ? dayjs(parseToDate(formData?.dueDate))
                          : null
                      }
                      onChange={(newValue) =>
                        handleChange(
                          "dueDate",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : null,
                        )
                      }
                    />
                  </div>
                </Box>
              </div>
            </div>
          </div>

          <Box display={"flex"} justifyContent={"end"} gap={2} marginTop={2}>
            <Button type="button" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <FormControl>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </FormControl>
          </Box>
        </form>
      )}
    </>
  );
}
