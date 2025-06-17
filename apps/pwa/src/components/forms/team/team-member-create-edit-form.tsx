/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Department, Role, TeamMember } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

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
import { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPhoneInput from "react-phone-input-material-ui";

export type TeamMembersFormProps = {
  type: "create" | "edit";
  member: TeamMember;
  roles: Role[];
  onDataSubmit: (data: any) => void;
  onClose: () => void;
};

export default function TeamMemberCreateEditForm({
  type,
  member,
  roles,
  onDataSubmit,
  onClose,
}: TeamMembersFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createTeamMemberSchema),
  });

  const [formData, setFormData] = useState<TeamMember | null>(null);

  const handleChange = useCallback((name: string, value: any) => {
    console.log("name", name, "value", value);
    setFormData((prev) => ({
      ...(prev as TeamMember),
      [name]: value,
    }));
    setValue(name, value);
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
    if (member && type) {
      console.log("TYPE", type, member);

      let _member: TeamMember | null = null;

      if (type === "create") {
        _member = {
          id: Date.now().toString(),
          name: "",
          lastName: "",
          email: "",
          role: "",
          avatar: "",
          department: "",
          contactPhone: "",
        };
      } else if (type === "edit") {
        _member = member;
      }

      reset(_member as TeamMember);
      setFormData(_member);
    }
  }, [member, type]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full p-4"
          style={{
            backgroundColor: "var(--mui-palette-background-default)",
          }}
        >
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
                  {/* * EMAIL */}
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
                      // className="capitalize"
                      onChange={(e) => handleChange("role", e.target.value)}
                    >
                      {roles &&
                        roles.length > 0 &&
                        roles.map((role) => (
                          <MenuItem
                            key={role}
                            value={role}
                            // className="capitalize"
                          >
                            {role}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {/* * DEPARTMENT */}
                  <FormControl fullWidth>
                    <InputLabel id="department-select">Department</InputLabel>
                    <Select
                      name="department"
                      id="department"
                      value={(formData.department as string) || ""}
                      label="Department"
                      // className="capitalize"
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                    >
                      {Department &&
                        Object.values(Department).length > 0 &&
                        Object.values(Department).map((department) => (
                          <MenuItem
                            key={department}
                            value={department}
                            // className="capitalize"
                          >
                            {department}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {/* * CONTACT PHONE */}
                  <Fragment>
                    <ReactPhoneInput
                      value={formData.contactPhone}
                      onChange={(phone) => handleChange("contactPhone", phone)} // passed function receives the phone value
                      component={TextField}
                    />
                  </Fragment>
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
                {type === "create" ? "Create" : "Update"}
              </Button>
            </FormControl>
          </Box>
        </form>
      )}
    </>
  );
}
