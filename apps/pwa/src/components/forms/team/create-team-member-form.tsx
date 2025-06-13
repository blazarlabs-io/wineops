/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Role, TeamMember } from "@/models/types/db";
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
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type TeamMembersFormProps = {
  roles: Role[];
  onDataSubmit: (data: any) => void;
};

export default function CreateTeamMemberForm({
  roles,
  onDataSubmit,
}: TeamMembersFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createTeamMemberSchema),
  });

  const [formData, setFormData] = useState<TeamMember | null>(null);

  const handleChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({
      ...(prev as TeamMember),
      [name]: value,
    }));
  }, []);

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);
    onDataSubmit(data);
    setFormData(data);
  };

  useEffect(() => {
    const newTeamMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      lastName: "",
      email: "",
      role: Role.MEMBER,
      avatar: "",
    };
    reset(newTeamMember);
    setFormData(newTeamMember);
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
                {/* <Label htmlFor="id">Id</Label> */}
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
                {/* <DemoItem label="DatePicker"> */}
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                  {/* * FIRST NAME */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="First Name"
                        variant="outlined"
                        {...register("name")}
                      />
                    </FormControl>
                  </div>
                  {/* * LAST NAME */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        {...register("lastName")}
                      />
                    </FormControl>
                  </div>
                  {/* * LAST NAME */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        {...register("email")}
                      />
                    </FormControl>
                  </div>
                  {/* * ROLE */}
                  <FormControl fullWidth>
                    <InputLabel id="role-select">Role</InputLabel>
                    <Select
                      name="role"
                      id="role"
                      value={(formData.role as string) || ""}
                      label="Role"
                      className="capitalize"
                      onChange={(e) => handleChange("role", e.target.value)}
                    >
                      {roles &&
                        roles.length > 0 &&
                        roles.map((role) => (
                          <MenuItem
                            key={role}
                            value={role}
                            className="capitalize"
                          >
                            {role}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
          </div>

          <Box display={"flex"} justifyContent={"end"} gap={2} marginTop={2}>
            <Button type="button" variant="outlined">
              Cancel
            </Button>
            <FormControl>
              <Button type="submit" variant="contained">
                Register
              </Button>
            </FormControl>
          </Box>
        </form>
      )}
    </>
  );
}
