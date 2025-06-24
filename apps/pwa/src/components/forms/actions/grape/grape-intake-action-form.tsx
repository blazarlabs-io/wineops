/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  GrapeIntakeAction,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
import { setNestedValue } from "@/helpers/form-helpers";
import { useGetGrapesNames } from "@/hooks/use-get-grapes-names";
import { useAuth } from "@/lib/firebase/auth";
import { grapeIntakeActionSchema } from "@/models/schemas/actions/grape-intake-action-schema";
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
import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Grape } from "@/models/types/db";

export default function GrapeIntakeActionForm() {
  const { grapes, actions } = useGrape();
  const { labReports } = useVineyard();

  const selectedGrapes = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Grape[];

  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(grapeIntakeActionSchema),
  });
  const { grapesNames } = useGetGrapesNames(grapes);
  const [formData, setFormData] = useState<GrapeIntakeAction>(
    {} as GrapeIntakeAction
  );
  const [disableSubject, setDisableSubject] = useState<boolean>(false);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
      }

      if (name === "subjectGrape.name") {
        console.log("name", grapes, value);
        const id = grapes.filter((g) => g.name === value)[0].id;
        setValue("subjectGrape.id", id);
        formData.subjectGrape = {
          name: name,
          id: id,
        };
      }

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

    const subjectGrape = grapes.filter(
      (v) => v.name === data.subjectGrape.name
    )[0];

    actions?.["grape-intake"].exec(user?.uid as string, data, subjectGrape);

    setFormData(data);
  };

  useEffect(() => {
    const grapeIntakeActionSample: GrapeIntakeAction = {
      id: Date.now().toString(),
      type: "grape-intake",
      mass: {
        net: 0,
      },
      subjectGrape: {
        name: "",
        id: "",
      },
      executionDate: new Date().toDateString(),
      weigherName: {
        name: teamMembers[0]?.name,
        email: teamMembers[0]?.email,
      },
      grapeVariety: "",
      qualityCharacteristics: {
        sugar: 0,
        acidity: 0,
      },
    };

    if (
      selectedGrapes &&
      selectedGrapes.length === 1 &&
      grapeIntakeActionSample.subjectGrape !== undefined &&
      grapeIntakeActionSample.mass !== undefined
    ) {
      setDisableSubject(true);
      grapeIntakeActionSample.subjectGrape.name = selectedGrapes[0]?.name;
      grapeIntakeActionSample.subjectGrape.id = selectedGrapes[0]?.id;
      grapeIntakeActionSample.grapeVariety = selectedGrapes[0]?.grapeVariety;
      grapeIntakeActionSample.mass.net = selectedGrapes[0]?.metrics.actual;
    } else if (
      grapes &&
      grapes.length > 0 &&
      grapeIntakeActionSample.subjectGrape !== undefined &&
      grapeIntakeActionSample.mass !== undefined
    ) {
      setDisableSubject(false);
      grapeIntakeActionSample.subjectGrape.name = grapes[0]?.name;
      grapeIntakeActionSample.subjectGrape.id = grapes[0]?.id;
      grapeIntakeActionSample.grapeVariety = grapes[0]?.grapeVariety;
      grapeIntakeActionSample.mass.net = grapes[0].metrics.actual;
    }

    if (labReports && labReports.length > 0) {
      console.log("LAB REPORTS", labReports);
      grapeIntakeActionSample.qualityCharacteristics = {
        sugar: labReports[0]?.results.sugar.value,
        acidity: labReports[0]?.results.acidity.value,
      };
    } else {
      grapeIntakeActionSample.qualityCharacteristics = {
        sugar: 0,
        acidity: 0,
      };
    }

    reset(grapeIntakeActionSample);
    setFormData(grapeIntakeActionSample);

    console.log("selectedGrapes", selectedGrapes);
    console.log("grapeIntakeActionSample", grapeIntakeActionSample);
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
          className="w-full"
          style={{ borderColor: "var(--mui-palette-divider)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="w-full">
              <div className="pr-3 flex flex-col gap-4 w-full ">
                {/* * ID - HIDDEN */}
                <div className="hidden">
                  {/* <Label htmlFor="id">Id</Label> */}
                  <FormControl>
                    <Input
                      id={formData.id as VineyardGlobalAction["id"]}
                      // value={formData.id}
                      type="hidden"
                      {...register("id")}
                    />
                  </FormControl>
                </div>

                <div className="flex flex-col w-full">
                  {/* <DemoItem label="DatePicker"> */}
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <FormControl fullWidth>
                      <InputLabel id="subject-select">
                        Subject of the Action
                      </InputLabel>
                      <Select
                        disabled={disableSubject}
                        name="subjectGrape.name"
                        // labelId="subject-select"
                        id="subject-select"
                        value={(formData?.subjectGrape?.name as string) || ""}
                        label="Subject of the Action"
                        onChange={(e) => {
                          handleChange("subjectGrape.name", e.target.value);
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
                    {/* * WEIGHER NAME */}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Weigher&apos;s Name
                      </InputLabel>
                      <Select
                        name="weigherName.name"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={
                          formData?.weigherName?.name ||
                          teamMembers[0]?.name ||
                          ""
                        }
                        label="Wheigher's Name"
                        onChange={(e) => {
                          handleChange("weigherName.name", e.target.value);
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
                    {/* * MASS */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="mass.gross"
                          label="Gross Mass (Kg)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("mass.gross")}
                        />
                      </FormControl>
                    </div>
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="mass.tare"
                          label="Tare Mass (Kg)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("mass.tare")}
                        />
                      </FormControl>
                    </div>
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="mass.net"
                          label="Net Mass (Tons)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("mass.net")}
                        />
                      </FormControl>
                    </div>
                    {/* *QUALITY CHARACTERISTICS */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.temperature"
                          label="Temperature (°C)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("qualityCharacteristics.temperature")}
                        />
                      </FormControl>
                    </div>
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.sugar"
                          label="Sugar"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("qualityCharacteristics.sugar")}
                        />
                      </FormControl>
                    </div>
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.acidity"
                          label="Acidity"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("qualityCharacteristics.acidity")}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.density"
                          label="Density"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("qualityCharacteristics.density")}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.massFractionSpoiled"
                          label="Mass Fraction Spoiled"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register(
                            "qualityCharacteristics.massFractionSpoiled"
                          )}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.massFractionCrushed"
                          label="Mass Fraction Crushed"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register(
                            "qualityCharacteristics.massFractionCrushed"
                          )}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="qualityCharacteristics.massFractionMixed"
                          label="Mass Fraction Mixed"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register(
                            "qualityCharacteristics.massFractionMixed"
                          )}
                        />
                      </FormControl>
                    </div>

                    {/* * LAB ID */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="labCertificateId"
                          label="Lab Certificate ID"
                          variant="outlined"
                          {...register("labCertificateId")}
                        />
                      </FormControl>
                    </div>

                    {/* * Certificat de Inofensivitate */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="certificateDeInofensiviate"
                          label="Certificate de Inofensivitate"
                          variant="outlined"
                          {...register("certificateDeInofensiviate")}
                        />
                      </FormControl>
                    </div>

                    {/* * labTechnicianName */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="labTechnicianName"
                          label="Lab Technician Name"
                          variant="outlined"
                          {...register("labTechnicianName")}
                        />
                      </FormControl>
                    </div>

                    {/* * TANSPORT INFO */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="transportInfo.vehicleId"
                          label="Vehicle ID"
                          variant="outlined"
                          {...register("transportInfo.vehicleId")}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="transportInfo.companyName"
                          label="Company Name"
                          variant="outlined"
                          {...register("transportInfo.companyName")}
                        />
                      </FormControl>
                    </div>

                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="transportInfo.driverId"
                          label="Driver ID"
                          variant="outlined"
                          {...register("transportInfo.driverId")}
                        />
                      </FormControl>
                    </div>

                    {/* * INVOICE ID */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="invoiceNumber"
                          label="Invoice Number"
                          variant="outlined"
                          {...register("invoiceNumber")}
                        />
                      </FormControl>
                    </div>
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
