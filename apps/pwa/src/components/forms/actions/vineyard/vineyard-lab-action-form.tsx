/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardGlobalActionSample } from "@/data/actions-samples";
import { VineyardActions, VineyardGlobalAction } from "@/models/types/actions";
import { Vineyard } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
import { useGetVineyardsNames } from "@/hooks/use-get-vineyards-names";
import { useAuth } from "@/lib/firebase/auth";
import { vineyardGlobalActionSchema } from "@/models/schemas/actions/vineyard-global-action-schema";
import { generateNotes } from "@/utils/generators";
import { Attachment } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  TextField as Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setNestedValue } from "@/helpers/form-helpers";

export type HarvestActionFormProps = {
  vineyards: Vineyard[];
  selectedVineyards?: Vineyard[];
  actions?: VineyardActions;
};

export default function VineyardLabActionForm({
  vineyards,
  actions,
}: HarvestActionFormProps) {
  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardGlobalActionSchema),
  });
  const { vineyardNames } = useGetVineyardsNames(vineyards);
  const [formData, setFormData] = useState<VineyardGlobalAction>(
    vineyardGlobalActionSample
  );

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
      }

      if (name === "inUseVineyard.name") {
        //value = Timestamp.fromDate(value.toDate());
        setValue(
          "inUseVineyard.id" as string,
          vineyards.filter((v) => v.name === value)[0]?.id as string
        );
        setValue("inUseVineyard.name" as string, value as any);
      } else {
        setValue(name as string, value as any);
      }

      const path = name.split(".");
      const newFormData = setNestedValue(formData, path, value);

      setFormData(newFormData);
    },
    [formData, setValue]
  );

  // const handleDateChange = useCallback((name: string, value: any) => {
  //   setFormData((prev) => ({
  //     ...(prev as VineyardGlobalAction),
  //     [name]: value,
  //   }));
  //   setValue(name, value.toTimestamp());
  // }, []);

  const handleInUseVineyardChange = useCallback(
    (value: any) => {
      const subjectVineyard = vineyards.filter((v) => v.name === value)[0];
      console.log("value", value, subjectVineyard);
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        inUseVineyard: {
          id: subjectVineyard.id,
          name: subjectVineyard.name,
        },
      }));
      setValue("inUseVineyard", {
        id: subjectVineyard.id,
        name: subjectVineyard.name,
      });
    },

    [setValue, vineyards]
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectVineyard = vineyards.filter(
      (v) => v.id === data.inUseVineyard.id
    )[0];

    actions?.["lab-report"].exec(user?.uid as string, data, subjectVineyard);

    setFormData(data);
  };

  useEffect(() => {
    if (
      vineyards &&
      vineyards.length > 0 &&
      teamMembers &&
      teamMembers.length > 0
    ) {
      vineyardGlobalActionSample.id = Date.now().toString();
      vineyardGlobalActionSample.type = "lab-report";
      vineyardGlobalActionSample.inUseVineyard = {
        id: vineyards[0].id,
        name: vineyards[0].name,
      };

      vineyardGlobalActionSample.executionDate = new Date().toDateString();

      vineyardGlobalActionSample.notes = generateNotes();

      if (vineyardGlobalActionSample.responsible) {
        vineyardGlobalActionSample.responsible.name = teamMembers[0].name;
        vineyardGlobalActionSample.responsible.email = teamMembers[0].email;
      }

      reset(vineyardGlobalActionSample);

      setFormData(vineyardGlobalActionSample);

      console.log("vineyardGlobalActionSample", vineyardGlobalActionSample);
    }
  }, [vineyards, teamMembers]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          className="pl-4 w-full border-l"
          style={{ borderColor: "var(--mui-palette-divider)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="w-full">
              <div className="pl-4 flex flex-col gap-4 w-full">
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
                    {/* * In use Vineyard */}
                    {/* TODO Needs to update both vineyard name and id */}
                    <FormControl fullWidth>
                      <InputLabel id="subject-select">
                        In Use Vineyard
                      </InputLabel>
                      <Select
                        name="inUseVineyard.name"
                        // labelId="subject-select"
                        id="inUseVineyard.name"
                        value={(formData.inUseVineyard.name as string) || ""}
                        label="In Use Vineyard"
                        onChange={(e) => {
                          handleInUseVineyardChange(e.target.value);
                        }}
                      >
                        {vineyardNames &&
                          vineyardNames.length > 0 &&
                          vineyardNames.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {/* * EXECUTION DATE */}
                    <Stack gap={1} className="w-full">
                      <DatePicker
                        name="executionDate"
                        value={
                          formData.executionDate instanceof Timestamp
                            ? dayjs(formData.executionDate.toDate())
                            : dayjs(formData.executionDate)
                        }
                        label="Execution Date"
                        disablePast
                        views={["year", "month", "day"]}
                        className="w-full"
                        onChange={(date) => {
                          if (date) {
                            handleChange("executionDate", date);
                          } else {
                            handleChange("executionDate", undefined);
                          }
                        }}
                      />
                    </Stack>
                    {/* * RESPONSIBLE */}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Responsible&apos;s Name
                      </InputLabel>
                      <Select
                        name="responsible.name"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={
                          formData?.responsible?.name ||
                          teamMembers[0].name ||
                          ""
                        }
                        label="Responsible's Name"
                        onChange={(e) => {
                          handleChange("responsible.name", e.target.value);
                          handleChange(
                            "responsible.email",
                            teamMembers.filter(
                              (member) => member.name === e.target.value
                            )[0].email
                          );
                        }}
                      >
                        {teamMembers &&
                          teamMembers.length > 0 &&
                          teamMembers.map((member) => (
                            <MenuItem key={member.name} value={member.name}>
                              {member.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {/* * LATEST LAB DATA */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          label="Sugar"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("inputData.sugar")}
                        />
                      </FormControl>
                    </div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="outlined-basic"
                        label="Acidity"
                        variant="outlined"
                        inputProps={{
                          min: "0",
                          step: "0.01",
                        }}
                        {...register("inputData.acidity")}
                      />
                    </FormControl>

                    {/* * NOTES */}
                    {/* <FormControl fullWidth>
                      <TextField
                        type="text"
                        id="description"
                        label="Description"
                        variant="outlined"
                        {...register("description")}
                      />
                    </FormControl> */}

                    <Stack gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Supporting Documents
                      </Typography>
                      <Stack
                        gap={1}
                        padding={2}
                        sx={{
                          border: "2px",
                          borderColor: "var(--mui-palette-divider)",
                          borderStyle: "solid",
                          borderRadius: "8px",
                        }}
                      >
                        <Button
                          variant="contained"
                          component="label"
                          className="w-full flex items-center gap-2"
                        >
                          <Attachment className="w-4 h-4" />
                          Upload File
                          <input type="file" hidden />
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </div>
              </div>
            </div>

            <Box display={"flex"} justifyContent={"end"}>
              <FormControl>
                <Button type="submit" variant="contained" className="mt-8">
                  Execute
                </Button>
              </FormControl>
            </Box>
          </form>
        </div>
      )}
    </>
  );
}
