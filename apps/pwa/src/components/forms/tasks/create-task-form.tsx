/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Note, Priority, Role, Task, TeamMember } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useAuth } from "@/lib/firebase/auth";
import { createTeamMemberSchema } from "@/models/schemas/create-team-member-schema";
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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createNoteSchema } from "@/models/schemas/create-note-schema";
import { DatePicker } from "@mui/x-date-pickers";
import { parseToDate } from "@/utils/date-format";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { createTaskSchema } from "@/models/schemas/create-task-schema";

export type CreateTaskFormProps = {
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
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createTaskSchema),
  });

  const [formData, setFormData] = useState<Task | null>(null);

  const handleChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({
      ...(prev as Task),
      [name]: value,
    }));
  }, []);

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);
    // onDataSubmit(data);
    setFormData(data);
  };

  useEffect(() => {
    const member = teamMembers.filter((v) => v.id === uid)[0];
    console.log("MEMBER", member, uid);
    const newTask: Task = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      assignedTo: member,
    };
    reset(newTask);
    setFormData(newTask);
  }, []);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="w-full py-4">
            <div className="flex flex-col gap-4 w-full">
              {/* * ID - HIDDEN */}
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
                  {/* * TITLE */}
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
                  {/* * DESCRIPTION */}
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
                  {/* * ASSIGNED TO   */}
                  <div className="">
                    <FormControl fullWidth>
                      <InputLabel id="assignedTo">Assigned To</InputLabel>
                      <Select
                        id="assignedTo"
                        name="assignedTo"
                        labelId="assignedTo"
                        label="Assigned To"
                        variant="outlined"
                        value={formData?.assignedTo?.name || ""}
                        // {...register("assignedTo")}
                        onChange={(e) => {
                          handleChange(
                            "assignedTo",
                            teamMembers.filter(
                              (v) => v.id === e.target.value
                            )[0]
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
                  {/* * DURATION */}
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
                  {/* * SUBJECT OF ACTION */}
                  <Typography variant="body1">Subject of Action</Typography>
                  {/* * DASHBOARD */}
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
                  {/* * OBJECT */}
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
                  {/* * PRIORITY  */}
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
                  {/* * START DATE */}
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
                            : null
                        )
                      }
                    />
                  </div>
                  {/* * DUE DATE */}
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
                            : null
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
