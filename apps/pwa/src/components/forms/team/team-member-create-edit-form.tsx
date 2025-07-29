"use client";

import { VineyardGlobalAction } from "@/models/types/actions";
import { Department, FormMode, Role, TeamMember } from "@/models/types/db";
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
import { useSnackbar } from "notistack";
import { db } from "@/lib/firebase/services";
import { useAuth } from "@/lib/firebase/auth";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useWinery } from "@/context/winery";

export default function TeamMemberCreateEditForm() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { teamMembers } = useWinery();
  const existingMember =
    teamMembers?.find(({ id }) => id === selected[0]?.id) || null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createTeamMemberSchema),
  });

  const [formData, setFormData] = useState<TeamMember>();

  const handleChange = useCallback(
    (name: string, value: any) => {
      setFormData((prev) => ({
        ...(prev as TeamMember),
        [name]: value,
      }));
      setValue(name, value);
    },
    [setValue],
  );

  const onSubmit = async (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (formType === "create") {
      const teamRes = await db.team.create(user?.uid, data);

      if (teamRes.status === 200) {
        enqueueSnackbar("Team member created successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error creating team member", { variant: "error" });
      }
    } else if (formType === "edit") {
      const teamRes = await db.team.update(user?.uid, data);

      if (teamRes.status === 200) {
        enqueueSnackbar("Team member updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error updating team member", { variant: "error" });
      }
    }

    closeDrawer();

    setFormData(data);
  };

  useEffect(() => {
    const formatted = {
      ...existingMember,
      ...(!existingMember && {
        id: Date.now().toString(),
        name: "",
        lastName: "",
        email: "",
        role: "",
        avatar: "",
        department: "",
        contactPhone: "",
      }),
    } as TeamMember;

    reset(formatted);
    setFormData(formatted);
  }, [existingMember, reset, selected]);

  useEffect(() => {
    if (errors) {
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
              {}
              <div className="hidden">
                {}
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
                {}
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                  {}
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
                  {}
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
                  {}
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
                  {}
                  <FormControl fullWidth>
                    <InputLabel id="role-select">Role</InputLabel>
                    <Select
                      name="role"
                      id="role"
                      value={(formData.role as string) || ""}
                      label="Role"
                      onChange={(e) => handleChange("role", e.target.value)}
                    >
                      {Object.values(Role)?.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {}
                  <FormControl fullWidth>
                    <InputLabel id="department-select">Department</InputLabel>
                    <Select
                      name="department"
                      id="department"
                      value={(formData.department as string) || ""}
                      label="Department"
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                    >
                      {Department &&
                        Object.values(Department).length > 0 &&
                        Object.values(Department).map((department) => (
                          <MenuItem key={department} value={department}>
                            {department}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {}
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
            <Button type="button" variant="outlined" onClick={closeDrawer}>
              Cancel
            </Button>
            <FormControl>
              <Button type="submit" variant="contained">
                {formType === "create" ? "Create" : "Update"}
              </Button>
            </FormControl>
          </Box>
        </form>
      )}
    </>
  );
}
