"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Note, Role, TeamMember } from "@/models/types/db";
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
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createNoteSchema } from "@/models/schemas/create-note-schema";
import { DatePicker } from "@mui/x-date-pickers";
import { parseToDate } from "@/utils/date-format";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

type CreateNoteFormProps = {
  teamMembers: TeamMember[];
  uid: string;
  onDataSubmit: (data: any) => void;
  onClose: () => void;
};

export default function CreateNoteForm({
  teamMembers,
  uid,
  onDataSubmit,
  onClose,
}: CreateNoteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createNoteSchema),
  });

  const [formData, setFormData] = useState<Note | null>(null);

  const handleChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({
      ...(prev as Note),
      [name]: value,
    }));
  }, []);

  const onSubmit = useCallback(
    (data: any, e: any) => {
      e.stopPropagation();
      e.preventDefault();
      onDataSubmit(data);
      setFormData(data);
    },
    [onDataSubmit],
  );

  useEffect(() => {
    const member = teamMembers.find((v) => v.id === uid);
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      date: new Date().toISOString(),
      author: member,
    };
    reset(newNote);
    setFormData(newNote);
  }, []);

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
              <div className="flex flex-col gap-2">
                <InputLabel className="text-sm text-muted-foreground">
                  Enter date
                </InputLabel>

                <DatePicker
                  label="Date"
                  value={
                    formData?.date ? dayjs(parseToDate(formData?.date)) : null
                  }
                  onChange={(newValue) =>
                    handleChange(
                      "date",
                      newValue ? Timestamp.fromDate(newValue.toDate()) : null,
                    )
                  }
                />
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
                        aria-label="content"
                        placeholder="Describe your note..."
                        minRows={3}
                        {...register("content")}
                        style={{
                          width: "100%",
                          borderColor: "var(--mui-palette-divider)",
                        }}
                        className="border-2 rounded-md p-2"
                      />
                    </FormControl>
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
