/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  GrapeActions,
  GrapeIntakeAction,
  GrapeProcessingAction,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { Grape, LabReport } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
import { setNestedValue } from "@/helpers/form-helpers";
import { useGetGrapesNames } from "@/hooks/use-get-grapes-names";
import { useAuth } from "@/lib/firebase/auth";
import { grapeProcessingActionSchema } from "@/models/schemas/actions/grape-processing-action-schema";
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
import { useMust } from "@/context/must";

export type GrapeActionFormProps = {
  grapes: Grape[];
  selectedGrapes?: Grape[];
  actions?: GrapeActions;
  labReports?: LabReport[];
};

export default function GrapeProcessingActionForm({
  grapes,
  selectedGrapes,
  actions,
  labReports,
}: GrapeActionFormProps) {
  const { musts } = useMust();
  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(grapeProcessingActionSchema),
  });
  const { grapesNames } = useGetGrapesNames(grapes);
  const [formData, setFormData] = useState<GrapeProcessingAction>(
    {} as GrapeProcessingAction
  );
  const [disableSubject, setDisableSubject] = useState<boolean>(false);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
      }

      //   if (name === "subjectGrape.name") {
      //     console.log("name", grapes, value);
      //     const id = grapes.filter((g) => g.name === value)[0].id;
      //     setValue("subjectGrape.id", id);
      //     formData.subjectGrape = {
      //       name: name,
      //       id: id,
      //     };
      //   }

      setValue(name, value);
      const path = name.split(".");
      const newFormData = setNestedValue(formData, path, value);
      setFormData(newFormData);
    },
    [formData, setValue]
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectGrape = grapes.filter((g) => g?.name === data?.batchId)[0];

    console.log("SUBJECT GRAPE", subjectGrape);

    actions?.["grape-processing"].exec(user?.uid as string, data, subjectGrape);

    setFormData(data);
  };

  useEffect(() => {
    const grapeProcessingActionSample: GrapeProcessingAction = {
      id: Date.now().toString(),
      batchId: "",
      type: "grape-processing",
      quantity: 0,
      executionDate: new Date().toDateString(),
      receivingBay: {},
      destemmer: {},
      press: {},
      pressPercentage: {
        mustId: `MustID_${musts.length + 1}`,
        inputQuantity: 0,
        vessel: "",
        newPressPercentage: 0,
      },
      labReport: {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          name: "",
          email: "",
        },
        units: "",
        results: {
          sugar: {
            value: 0,
            variation: 0,
          },
          acidity: {
            value: 0,
            variation: 0,
          },
        },
      },
      wasteQuantity: 0,
    };

    if (selectedGrapes && selectedGrapes.length === 1) {
      grapeProcessingActionSample.batchId = selectedGrapes[0].name;

      grapeProcessingActionSample.labReport = {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          name: teamMembers[0]?.name,
          email: teamMembers[0]?.email,
        },
        units: selectedGrapes[0].labData.acidity.unit as string,
        results: {
          sugar: {
            value: selectedGrapes[0].labData.acidity.value as number,
            variation: 0,
          },
          acidity: {
            value: selectedGrapes[0].labData.acidity.value as number,
            variation: 0,
          },
        },
      };
      setDisableSubject(true);
    } else if (grapes && grapes.length > 0) {
      grapeProcessingActionSample.batchId = grapes[0]?.name;

      grapeProcessingActionSample.labReport = {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          name: teamMembers[0]?.name,
          email: teamMembers[0]?.email,
        },
        units: grapes[0]?.labData.acidity.unit as string,
        results: {
          sugar: {
            value: grapes[0]?.labData.acidity.value as number,
            variation: 0,
          },
          acidity: {
            value: grapes[0]?.labData.acidity.value as number,
            variation: 0,
          },
        },
      };
      setDisableSubject(false);
    }

    if (labReports && labReports.length > 0) {
      console.log("LAB REPORTS", labReports);
    } else {
    }

    reset(grapeProcessingActionSample);
    setFormData(grapeProcessingActionSample);

    console.log("selectedGrapes", selectedGrapes);
    console.log("grapeProcessingActionSample", grapeProcessingActionSample);
  }, [grapes, selectedGrapes]);

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
                <div className="flex flex-col w-full">
                  {/* <DemoItem label="DatePicker"> */}
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    {/* * ID */}
                    {/* * QUANTITY */}
                    <div className="hidden">
                      <FormControl fullWidth>
                        {/* <InputLabel id="quantity-select">
                          Grape Quantity (Kg)
                        </InputLabel> */}
                        <TextField
                          type="number"
                          id="id-field"
                          label="ID"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("quantity")}
                        />
                      </FormControl>
                    </div>

                    {/* * BATCH ID */}
                    <FormControl fullWidth>
                      <InputLabel id="batchId-select">Batch ID</InputLabel>
                      <Select
                        disabled={disableSubject}
                        name="batchId"
                        // labelId="subject-select"
                        id="batchId-select"
                        value={(formData?.batchId as string) || ""}
                        label="Batch ID"
                        onChange={(e) => {
                          handleChange("batchId", e.target.value);
                        }}
                      >
                        {grapesNames &&
                          grapesNames.length > 0 &&
                          grapesNames.map((name) => (
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
                    {/* * QUANTITY */}
                    <div className="">
                      <FormControl fullWidth>
                        {/* <InputLabel id="quantity-select">
                          Grape Quantity (Kg)
                        </InputLabel> */}
                        <TextField
                          type="number"
                          id="quantity-select"
                          label="Grape Quantity (Kg)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("quantity")}
                        />
                      </FormControl>
                    </div>

                    {/* TODO */}
                    {/* * RECEIVING BAY */}
                    {/* * DESTEMMER */}
                    {/* * PRESS */}

                    {/* * PRESS PERCENTAGE */}
                    <Typography variant="body1">Press Percentage</Typography>
                    {/* * Must Name */}
                    <div className="">
                      <FormControl fullWidth>
                        {/* <InputLabel id="must-select">Must Name</InputLabel> */}
                        <TextField
                          id="pressPercentage.mustId"
                          label="Must Name"
                          variant="outlined"
                          {...register("pressPercentage.mustId")}
                        />
                      </FormControl>
                    </div>
                    {/* * Input Quantity */}
                    <div className="">
                      <FormControl fullWidth>
                        {/* <InputLabel id="must-select">Input Quantity</InputLabel> */}
                        <TextField
                          type="number"
                          id="pressPercentage.inputQuantity"
                          label="Input Quantity"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("pressPercentage.inputQuantity")}
                        />
                      </FormControl>
                    </div>
                    {/* * Vessel */}
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="vessel-select">Vessel</InputLabel>
                        <Select
                          disabled
                          name="pressPercentage.vessel"
                          // labelId="subject-select"
                          id="vessel-select"
                          value={
                            (formData?.pressPercentage?.vessel as string) ||
                            "No vessels"
                          }
                          label="Vessel"
                          onChange={(e) => {
                            handleChange(
                              "pressPercentage.vessel",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"No vessels"}>
                            {"No vessels"}
                          </MenuItem>
                          {grapesNames &&
                            grapesNames.length > 0 &&
                            grapesNames.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                    {/* * New Press % */}
                    <div className="">
                      <FormControl fullWidth>
                        {/* <InputLabel id="must-select">New Press %</InputLabel> */}
                        <TextField
                          type="number"
                          id="pressPercentage.newPressPercentage"
                          label="New Press %"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("pressPercentage.newPressPercentage")}
                        />
                      </FormControl>
                    </div>
                    {/* * New Press % */}
                    <div className="">
                      <FormControl fullWidth>
                        {/* <InputLabel id="wasteQuantity-select">
                          Waste Quantity
                        </InputLabel> */}
                        <TextField
                          type="number"
                          id="wasteQuantity"
                          label="Waste Quantity"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("wasteQuantity")}
                        />
                      </FormControl>
                    </div>
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
