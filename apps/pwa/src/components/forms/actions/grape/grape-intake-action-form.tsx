/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  GrapeIntakeAction,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
import { setNestedValue } from "@/helpers/form-helpers";
import { useAuth } from "@/lib/firebase/auth";
import { grapeIntakeActionSchema } from "@/models/schemas/actions/grape-intake-action-schema";
import { Attachment, DeleteOutline, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  TextField as Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGrape } from "@/context/grape";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Grape, GrapeStatus } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { File } from "lucide-react";
import { db } from "@/lib/firebase/services";

export default function GrapeIntakeActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { grapes, actions } = useGrape();

  const selectedGrapes = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Grape[];

  const updatedSelectedGrapes = useMemo(
    () =>
      selectedGrapes.map(
        (selected) => grapes.find((g) => g.id === selected.id) ?? selected
      ),
    [grapes, selectedGrapes]
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: joiResolver(grapeIntakeActionSchema),
  });

  const filteredGrapes = useMemo(
    () =>
      (updatedSelectedGrapes.length > 0
        ? updatedSelectedGrapes
        : grapes
      ).filter(
        ({ rowType, status }) =>
          rowType === "item" && status === GrapeStatus.IN_TRANSIT
      ),
    [grapes, updatedSelectedGrapes]
  );

  const [formData, setFormData] = useState<GrapeIntakeAction>(
    {} as GrapeIntakeAction
  );
  const [disableSubject, setDisableSubject] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name === "subjectGrape.name") {
        const id = filteredGrapes.filter(({ name }) => name === value)[0].id;
        setValue("subjectGrape.id", id);
        formData.subjectGrape = {
          name: name,
          id: id,
        };
      }

      setValue(name, value);

      if (name.startsWith("executionDate")) {
        setFormData((prev) => ({
          ...(prev as GrapeIntakeAction),
          [name]: value,
        }));
      } else {
        const path = name.split(".");
        const newFormData = setNestedValue(formData, path, value);
        setFormData(newFormData);
      }
    },
    [filteredGrapes, formData, setValue]
  );

  const handleNewUpload = useCallback(
    (name: string, url: string, file: File) => {
      const filesUrls = formData.supportingDocuments || [];

      filesUrls.push({
        name: file.name,
        url,
      });

      setFormData((prev) => ({
        ...(prev as GrapeIntakeAction),
        supportingDocuments: filesUrls,
      }));

      setValue(name, filesUrls);
    },
    [formData.supportingDocuments, setValue]
  );

  const handleFile = useCallback(
    (e: any) => {
      const file = e.target.files[0];

      supportingDocumentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (!file) {
        setError(`supportingDocuments`, {
          type: "manual",
          message: `Missing file`,
        });

        return;
      }

      if (
        (formData.supportingDocuments || [])
          .map(({ name }) => name)
          .includes(file.name)
      ) {
        setError(`supportingDocuments`, {
          type: "manual",
          message: `File ${file.name} has already been uploaded`,
        });

        return;
      }

      clearErrors("supportingDocuments");

      db.storage.uploadFile(
        file,
        user?.uid,
        "grapeIntake",
        (progress: number) => {
          setIsUploading(true);
          setUploadProgress(progress);
        },
        (complete: string) => {
          setIsUploading(false);
          setUploadProgress(0);
          console.log(complete);
          handleNewUpload("supportingDocuments", complete, file);

          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        (error: Error) => {
          setIsUploading(false);
          setUploadProgress(0);
          console.log(error);

          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      );
    },
    [
      clearErrors,
      formData.supportingDocuments,
      handleNewUpload,
      setError,
      user?.uid,
    ]
  );

  const handleDeleteFile = useCallback(
    async (name: string, index: number) => {
      const filesUrls = formData.supportingDocuments || [];
      filesUrls.splice(index, 1);

      setFormData((prev) => ({
        ...(prev as GrapeIntakeAction),
        supportingDocuments: filesUrls,
      }));

      setValue("supportingDocuments", filesUrls);
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "grapeIntake",
        name
      );

      if (deleteFileRes.status == 200) {
        console.log("File deleted");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        console.log("Error deleting file");
      }
    },
    [clearErrors, formData.supportingDocuments, setValue, user?.uid]
  );

  const onSubmit = async (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectGrape = filteredGrapes.filter(
      ({ name }) => name === data.subjectGrape.name
    )[0];

    setIsSubmitting(true);

    try {
      await actions?.["grape-intake"].exec(
        user?.uid as string,
        data,
        subjectGrape
      );
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    const grapeIntakeActionSample: GrapeIntakeAction = {
      id: crypto.randomUUID(),
      type: "grape-intake",
      subjectGrape: {
        name: "",
        id: "",
      },
      executionDate: Timestamp.fromDate(new Date()), //new Date().toDateString(),
      weigherName: {
        id: teamMembers[0]?.id,
        name: teamMembers[0]?.name,
        email: teamMembers[0]?.email,
      },
      supplier: {
        companyName: "",
      },
      grapeVariety: "",
      mass: {},
      qualityCharacteristics: {},
      processingLocation: "",
      supportingDocuments: [],
    };

    if (
      filteredGrapes &&
      filteredGrapes.length === 1 &&
      grapeIntakeActionSample.subjectGrape !== undefined &&
      grapeIntakeActionSample.mass !== undefined
    ) {
      setDisableSubject(true);
      grapeIntakeActionSample.subjectGrape.name = filteredGrapes[0]?.name;
      grapeIntakeActionSample.subjectGrape.id = filteredGrapes[0]?.id;
      grapeIntakeActionSample.grapeVariety = filteredGrapes[0]?.grapeVariety;
      grapeIntakeActionSample.mass.net = filteredGrapes[0]?.metrics?.actual;
    } else if (
      filteredGrapes &&
      filteredGrapes.length > 0 &&
      grapeIntakeActionSample.subjectGrape !== undefined &&
      grapeIntakeActionSample.mass !== undefined
    ) {
      setDisableSubject(false);
      grapeIntakeActionSample.subjectGrape.name = filteredGrapes[0]?.name;
      grapeIntakeActionSample.subjectGrape.id = filteredGrapes[0]?.id;
      grapeIntakeActionSample.grapeVariety = filteredGrapes[0]?.grapeVariety;
      grapeIntakeActionSample.mass.net = filteredGrapes[0]?.metrics?.actual;
    }

    grapeIntakeActionSample.qualityCharacteristics = {
      sugar: filteredGrapes[0]?.labData?.sugar?.value,
      acidity: filteredGrapes[0]?.labData?.acidity?.value,
    };

    reset(grapeIntakeActionSample);
    setFormData(grapeIntakeActionSample);
  }, [filteredGrapes, reset, teamMembers]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  if (!formData) return null;

  return (
    <div
      className="w-full"
      style={{
        borderColor: "var(--mui-palette-divider)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box
          className="w-full"
          sx={{
            py: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-4 w-full ">
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

            <Accordion disableGutters={true} defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`general-info-content`}
                id={`general-info-header`}
              >
                <Typography component="span">General Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <Autocomplete<Grape, false, false, false>
                      noOptionsText="No batches available"
                      options={filteredGrapes}
                      value={(formData?.subjectGrape as Grape) || null}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("subjectGrape", {
                          id: newValue.id,
                          name: newValue.name,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Batch ID"
                              : "Select batch ID"
                          }
                        />
                      )}
                    />

                    {((errors?.subjectGrape as any)?.id ||
                      (errors?.subjectGrape as any)?.name) && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          ((errors?.subjectGrape as any)?.id?.message ||
                            (errors?.subjectGrape as any)?.name
                              ?.message) as string
                        }
                      </Typography>
                    )}
                  </div>

                  {/* * EXECUTION DATE */}
                  <Stack gap={1} className="w-full">
                    <DatePicker
                      name="executionDate"
                      value={
                        formData?.executionDate
                          ? dayjs(parseToDate(formData?.executionDate))
                          : null
                      }
                      label={
                        formData.executionDate &&
                        formData.executionDate !== "Invalid Date"
                          ? "Execution Date"
                          : "Select execution date"
                      }
                      disablePast
                      views={["year", "month", "day"]}
                      className="w-full"
                      onChange={(date) => {
                        handleChange(
                          "executionDate",
                          date ? Timestamp.fromDate(date.toDate()) : null
                        );

                        return;
                        if (date) {
                          handleChange("executionDate", date);
                        } else {
                          handleChange("executionDate", undefined);
                        }
                      }}
                    />

                    {errors?.executionDate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.executionDate?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Input
                        id="supplier.companyName"
                        label="Supplier name"
                        type="text"
                        variant="outlined"
                        {...register("supplier.companyName")}
                      />
                    </FormControl>

                    {errors?.supplier &&
                      (errors?.supplier as any)?.companyName && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.supplier as any)?.companyName
                              ?.message as string
                          }
                        </Typography>
                      )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      freeSolo
                      options={[]}
                      value={formData?.grapeVariety || ""}
                      onChange={(_event, newValue) => {
                        handleChange("grapeVariety", newValue);
                      }}
                      onInputChange={(_event, newInputValue) => {
                        handleChange("grapeVariety", newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Grape variety"
                          variant="outlined"
                        />
                      )}
                    />

                    {errors?.grapeVariety && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.grapeVariety?.message as string}
                      </Typography>
                    )}
                  </div>

                  {/* * Certificat de Inofensivitate */}
                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        id="certificatDeInofensivitate"
                        label="Certificate de Inofensivitate"
                        variant="outlined"
                        {...register("certificatDeInofensivitate")}
                      />
                    </FormControl>

                    {errors?.certificatDeInofensivitate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.certificatDeInofensivitate?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters={true} defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`weight-info-content`}
                id={`weight-info-header`}
              >
                <Typography component="span">Weight Information</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.gross"
                        label="Gross weight (Kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                        }}
                        {...register("mass.gross")}
                      />

                      {(errors?.mass as any)?.gross && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {(errors?.mass as any)?.gross?.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.tare"
                        label="Tare weight (Kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                        }}
                        {...register("mass.tare")}
                      />

                      {(errors?.mass as any)?.tare && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {(errors?.mass as any)?.tare?.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.net"
                        label="Net weight (Kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                        }}
                        {...register("mass.net")}
                      />

                      {(errors?.mass as any)?.net && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {(errors?.mass as any)?.net?.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="hidden">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.gross"
                        label="Gross weight (Kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                        }}
                      />

                      {(errors?.mass as any)?.gross && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {(errors?.mass as any)?.gross?.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  {/* * WEIGHER NAME */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Operator name
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
                      label="Operator name"
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

                    {(errors?.weigherName as any)?.name && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {(errors?.weigherName as any)?.name?.message as string}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters={true} defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`quality-parameters-content`}
                id={`quality-parameters-header`}
              >
                <Typography component="span">Quality Parameters</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  {/* *QUALITY CHARACTERISTICS */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.temperature"
                        label="Temperature (°C)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: -200, step: 0.01, max: 1_000 },
                        }}
                        {...register("qualityCharacteristics.temperature")}
                      />

                      {(errors?.qualityCharacteristics as any)?.temperature && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)?.temperature
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.density"
                        label="Density (kg/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000 },
                        }}
                        {...register("qualityCharacteristics.density")}
                      />

                      {(errors?.qualityCharacteristics as any)?.density && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)?.density
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.sugar"
                        label="Sugar (g/dm³)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                        }}
                        {...register("qualityCharacteristics.sugar")}
                      />

                      {(errors?.qualityCharacteristics as any)?.sugar && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)?.sugar
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.acidity"
                        label="Acidity (g/dm³)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                        }}
                        {...register("qualityCharacteristics.acidity")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionSpoiled"
                        label="Affected grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionSpoiled"
                        )}
                      />

                      {(errors?.qualityCharacteristics as any)
                        ?.massFractionSpoiled && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)
                              ?.massFractionSpoiled?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionCrushed"
                        label="Crushed grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionCrushed"
                        )}
                      />

                      {(errors?.qualityCharacteristics as any)
                        ?.massFractionCrushed && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)
                              ?.massFractionCrushed?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionMixed"
                        label="Mixed grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionMixed"
                        )}
                      />

                      {(errors?.qualityCharacteristics as any)
                        ?.massFractionMixed && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.qualityCharacteristics as any)
                              ?.massFractionMixed?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  {/* * LAB ID */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="labCertificateId"
                        label="Lab certificate ID"
                        variant="outlined"
                        {...register("labCertificateId")}
                      />

                      {errors?.labCertificateId && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {(errors?.labCertificateId as any)?.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  {/* * labTechnicianName */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="labTechnicianName"
                        label="Technician name"
                        variant="outlined"
                        {...register("labTechnicianName")}
                      />

                      {errors?.labTechnicianName && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.labTechnicianName as any)
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters={true} defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`transportation-info-content`}
                id={`transportation-info-header`}
              >
                <Typography component="span">Transportation Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      freeSolo
                      options={[]}
                      value={formData?.processingLocation || ""}
                      onChange={(_event, newValue) => {
                        handleChange("processingLocation", newValue);
                      }}
                      onInputChange={(_event, newInputValue) => {
                        handleChange("processingLocation", newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Processing location"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>

                  {/* * INVOICE ID */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="invoiceNumber"
                        label="Dispatch invoice"
                        variant="outlined"
                        {...register("invoiceNumber")}
                      />
                    </FormControl>
                  </div>

                  {/* * TANSPORT INFO */}
                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.companyName"
                        label="Company name"
                        variant="outlined"
                        {...register("transportInfo.companyName")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.vehicleId"
                        label="Vehicle number"
                        variant="outlined"
                        {...register("transportInfo.vehicleId")}
                      />
                    </FormControl>
                  </div>

                  <div className="">
                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.driverId"
                        label="Driver name"
                        variant="outlined"
                        {...register("transportInfo.driverId")}
                      />
                    </FormControl>
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Stack p={2} gap={2}>
              <div className="">
                <FormControl fullWidth>
                  <TextField
                    id="additionalInfo"
                    label="Provide additional information"
                    variant="outlined"
                    {...register("additionalInfo")}
                  />
                </FormControl>
              </div>

              <Stack gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Supporting Documents
                </Typography>

                {isUploading && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                )}

                {formData.supportingDocuments &&
                  formData.supportingDocuments.length > 0 &&
                  formData.supportingDocuments.map((doc, index) => (
                    <Stack
                      key={doc.name}
                      gap={1}
                      display={"flex"}
                      alignItems={"center"}
                      direction={"row"}
                      justifyContent={"space-between"}
                    >
                      <Stack
                        gap={1}
                        display={"flex"}
                        alignItems={"center"}
                        direction={"row"}
                      >
                        <File width={16} height={16} />
                        <Typography variant="body2">{doc.name}</Typography>
                      </Stack>
                      <IconButton
                        size="small"
                        className="max-w-[24px] max-h-[24px]"
                        color="error"
                        onClick={() => handleDeleteFile(doc.name, index)}
                      >
                        <DeleteOutline className="max-w-4 max-h-4" />
                      </IconButton>
                    </Stack>
                  ))}

                {errors?.supportingDocuments && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.supportingDocuments?.message as string}
                  </Typography>
                )}
                <div ref={supportingDocumentsRef}></div>
              </Stack>
            </Stack>
          </div>
        </Box>

        <Box p={2} gap={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            component="label"
            className="w-auto flex items-center gap-2"
          >
            <Attachment className="w-4 h-4 rotate-90" />
            Upload File
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleFile}
            />
          </Button>

          <FormControl>
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="contained"
              className="mt-8"
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </form>
    </div>
  );
}
