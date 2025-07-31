/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  GrapeIntakeAction,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
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
  Stack,
  TextareaAutosize,
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
import { hasKeyFromArray } from "../../utils";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";

export default function GrapeIntakeActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [weightInfoExpanded, setWeightInfoExpanded] = useState(false);
  const [qualityParamsExpanded, setQualityParamsExpanded] = useState(false);
  const [transportInfoExpanded, setTransportInfoExpanded] = useState(false);

  const handleGeneralExpansion = () => {
    setGeneralExpanded((prevExpanded) => !prevExpanded);
  };

  const handleWeightInfoExpansion = () => {
    setWeightInfoExpanded((prevExpanded) => !prevExpanded);
  };

  const handleQualityParamsExpansion = () => {
    setQualityParamsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleTransportInfoExpansion = () => {
    setTransportInfoExpanded((prevExpanded) => !prevExpanded);
  };

  const { grapes, actions } = useGrape();

  const selectedGrapes = useSelectedEntitiesStore(
    ({ selected }) => selected,
  ) as Grape[];

  const filteredGrapes = useMemo(
    () =>
      (selectedGrapes.length > 0
        ? selectedGrapes.map(
            (selected) =>
              grapes.find(({ id }) => id === selected.id) ?? selected,
          )
        : grapes
      ).filter(
        ({ rowType, status }) =>
          rowType === "item" &&
          [GrapeStatus.NEW, GrapeStatus.IN_TRANSIT].some((s) => s === status),
      ),
    [grapes, selectedGrapes],
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();

  const userId =
    teamMembers?.find(
      ({ id, email }) => email === user?.email || id === user?.uid,
    )?.id ||
    user?.email ||
    user?.uid ||
    "";

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

  const [formData, setFormData] = useState<GrapeIntakeAction>(
    {} as GrapeIntakeAction,
  );

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name, value, { shouldTouch: true, shouldValidate: true });

      setFormData((prev) => ({
        ...(prev as GrapeIntakeAction),
        [name]: value,
      }));
    },
    [setValue],
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
    [formData.supportingDocuments, setValue],
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
        "grape-intake",
        (progress: number) => {
          setIsUploading(true);
          setUploadProgress(progress);
        },
        (complete: string) => {
          setIsUploading(false);
          setUploadProgress(0);
          handleNewUpload("supportingDocuments", complete, file);

          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        (error: Error) => {
          setIsUploading(false);
          setUploadProgress(0);

          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      );
    },
    [
      clearErrors,
      formData.supportingDocuments,
      handleNewUpload,
      setError,
      user?.uid,
    ],
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
        "grape-intake",
        name,
      );

      if (deleteFileRes.status == 200) {
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
      }
    },
    [clearErrors, formData.supportingDocuments, setValue, user?.uid],
  );

  const onSubmit = async (data: any) => {
    if (!user?.uid || !data.subjectGrape.id) return;

    const subjectGrape = filteredGrapes.filter(
      ({ id }) => id === data.subjectGrape.id,
    )[0];

    if (!subjectGrape) return;

    setIsSubmitting(true);

    try {
      await actions?.["grape-intake"].exec(user.uid, data, subjectGrape);
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  const subjectGrape = useMemo(
    () =>
      formData.subjectGrape?.id
        ? filteredGrapes.find(({ id }) => id === formData.subjectGrape?.id)
        : filteredGrapes?.length === 1
          ? filteredGrapes[0]
          : undefined,
    [filteredGrapes, formData.subjectGrape?.id],
  );

  useEffect(() => {
    if (!subjectGrape) return;

    const grapeIntakeActionSample: GrapeIntakeAction = {
      id: crypto.randomUUID(),
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: userId,
      type: "grape-intake",
      subjectGrape: subjectGrape
        ? { id: subjectGrape.id, name: subjectGrape.name }
        : { id: "", name: "" },
      executionDate: Timestamp.fromDate(new Date()),
      supplier: {
        companyName: "",
      },
      grapeVariety: subjectGrape?.grapeVariety ?? "",
      mass: {
        net: subjectGrape?.metrics?.actual,
      },
      qualityCharacteristics: {
        sugar: subjectGrape?.labData?.sugar?.value || undefined,
        acidity: subjectGrape?.labData?.acidity?.value || undefined,
      },
      processingLocation: subjectGrape?.location ?? "",
      supportingDocuments: [],
      certificatDeInofensivitate:
        subjectGrape?.transportationInfo?.certificate ?? "",
      transportInfo: {
        companyName: subjectGrape?.transportationInfo?.companyName ?? "",
        vehicleId: subjectGrape?.transportationInfo?.vehicleIdNo ?? "",
        driverId: subjectGrape?.transportationInfo?.driverIdNo ?? "",
      },
      invoiceNumber:
        subjectGrape?.transportationInfo?.acquisitionInvoiceNo ?? "",
    };

    reset(grapeIntakeActionSample);
    setFormData(grapeIntakeActionSample);
  }, [reset, subjectGrape, userId]);

  useEffect(() => {
    if (errors) {
      const hasGeneralErrors = hasKeyFromArray(
        [
          "subjectGrape",
          "executionDate",
          "supplier",
          "grapeVariety",
          "certificatDeInofensivitate",
        ],
        errors,
      );
      if (hasGeneralErrors) setGeneralExpanded(true);

      const hasWeightInfoErrors = hasKeyFromArray(["mass"], errors);
      if (hasWeightInfoErrors) setWeightInfoExpanded(true);

      const hasQualityParamsErrors = hasKeyFromArray(
        ["qualityCharacteristics", "labCertificateId", "labTechnicianName"],
        errors,
      );
      if (hasQualityParamsErrors) setQualityParamsExpanded(true);

      const hasTransportInfoError = hasKeyFromArray(
        ["processingLocation", "invoiceNumber", "transportInfo"],
        errors,
      );
      if (hasTransportInfoError) setTransportInfoExpanded(true);
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
          sx={{
            py: 2,
            flex: 1,
            width: "100%",
            overflowY: "auto",
          }}
        >
          <Stack gap={2}>
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

            <Accordion
              disableGutters={true}
              defaultExpanded={true}
              expanded={generalExpanded}
              onChange={handleGeneralExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`general-info-content`}
                id={`general-info-header`}
              >
                <Typography component="span">General Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Selected batch ID
                    </InputLabel>

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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Select execution date
                    </InputLabel>

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
                      views={["year", "month", "day"]}
                      className="w-full"
                      onChange={(date) => {
                        if (!date) return;

                        handleChange(
                          "executionDate",
                          Timestamp.fromDate(date.toDate()),
                        );
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

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter supplier name
                    </InputLabel>

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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter a grape variety
                    </InputLabel>

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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the certificat de inofensivitate ID
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="certificatDeInofensivitate"
                        label="Certificate de Inofensivitate"
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            ...(formData?.certificatDeInofensivitate && {
                              shrink: true,
                            }),
                          },
                        }}
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
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={weightInfoExpanded}
              onChange={handleWeightInfoExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`weight-info-content`}
                id={`weight-info-header`}
              >
                <Typography component="span">Weight Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter gross weight (kg)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.gross"
                        label="Gross weight (kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                          inputLabel: {
                            ...(formData?.mass?.gross && { shrink: true }),
                          },
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter tare weight (kg)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.tare"
                        label="Tare weight (kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                          inputLabel: {
                            ...(formData?.mass?.tare && { shrink: true }),
                          },
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter net weight (kg)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.net"
                        label="Net weight (kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                          inputLabel: {
                            ...(formData?.mass?.net && { shrink: true }),
                          },
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
                  </Stack>

                  <div className="hidden">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="mass.gross"
                        label="Gross weight (kg)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000_000 },
                          inputLabel: {
                            ...(formData?.mass?.gross && { shrink: true }),
                          },
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

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the weighbridge operator name
                    </InputLabel>

                    <FormControl fullWidth>
                      <ResponsibleTeamMemberField
                        label="Operator name"
                        teamMembers={teamMembers}
                        onChange={(value: any) => {
                          if (!value) return;

                          const responsible = teamMembers.find(({ name }) =>
                            value.startsWith(name),
                          );
                          handleChange("weigherName", responsible);
                        }}
                        currentValue={
                          formData?.weigherName?.name !== undefined &&
                          formData?.weigherName?.lastName !== undefined
                            ? `${formData?.weigherName?.name} ${formData?.weigherName?.lastName}`
                            : ""
                        }
                      />

                      {(errors?.weigherName as any)?.name && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            (errors?.weigherName as any)?.name
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </FormControl>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={qualityParamsExpanded}
              onChange={handleQualityParamsExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`quality-parameters-content`}
                id={`quality-parameters-header`}
              >
                <Typography component="span">Quality Parameters</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the sample temperature (°C)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.temperature"
                        label="Temperature (°C)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: -200, step: 0.01, max: 1_000 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics
                              ?.temperature || 0) > 0 && { shrink: true }),
                          },
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the density (kg/L)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.density"
                        label="Density (kg/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics?.density ||
                              0) > 0 && { shrink: true }),
                          },
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel
                      className="text-sm text-muted-foreground"
                      sx={{ whiteSpace: "normal" }}
                    >
                      Enter the mass concentration of sugars (g/dm³)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.sugar"
                        label="Sugar (g/dm³)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics?.sugar || 0) >
                              0 && { shrink: true }),
                          },
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the acidity (g/dm³)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.acidity"
                        label="Acidity (g/dm³)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics?.acidity ||
                              0) > 0 && { shrink: true }),
                          },
                        }}
                        {...register("qualityCharacteristics.acidity")}
                      />
                    </FormControl>
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground whitespace-normal!">
                      Enter mass fraction of grapes affected by diseases and
                      pests (%)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionSpoiled"
                        label="Affected grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics
                              ?.massFractionSpoiled || 0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionSpoiled",
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter mass fraction of crushed grapes (%)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionCrushed"
                        label="Crushed grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics
                              ?.massFractionCrushed || 0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionCrushed",
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground whitespace-normal!">
                      Enter mass fraction of mixed grape varieties (%)
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="qualityCharacteristics.massFractionMixed"
                        label="Mixed grapes (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                          inputLabel: {
                            ...((formData?.qualityCharacteristics
                              ?.massFractionMixed || 0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register(
                          "qualityCharacteristics.massFractionMixed",
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab certificate ID
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="labCertificateId"
                        label="Lab certificate ID"
                        variant="outlined"
                        {...register("labCertificateId")}
                        slotProps={{
                          inputLabel: {
                            ...(formData?.labCertificateId && { shrink: true }),
                          },
                        }}
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab technician name
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="labTechnicianName"
                        label="Technician name"
                        variant="outlined"
                        {...register("labTechnicianName")}
                        slotProps={{
                          inputLabel: {
                            ...(formData?.labTechnicianName && {
                              shrink: true,
                            }),
                          },
                        }}
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
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={transportInfoExpanded}
              onChange={handleTransportInfoExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`transportation-info-content`}
                id={`transportation-info-header`}
              >
                <Typography component="span">Transportation Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Select the processing location
                    </InputLabel>

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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the dispatch invoice
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="invoiceNumber"
                        label="Dispatch invoice"
                        variant="outlined"
                        {...register("invoiceNumber")}
                        slotProps={{
                          inputLabel: {
                            ...(formData?.invoiceNumber && { shrink: true }),
                          },
                        }}
                      />
                    </FormControl>
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the transportation company name
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.companyName"
                        label="Company name"
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            ...(formData?.transportInfo?.companyName && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("transportInfo.companyName")}
                      />
                    </FormControl>
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the vehicle registration number
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.vehicleId"
                        label="Vehicle number"
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            ...(formData?.transportInfo?.vehicleId && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("transportInfo.vehicleId")}
                      />
                    </FormControl>
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the driver name
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        id="transportInfo.driverId"
                        label="Driver name"
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            ...(formData?.transportInfo?.driverId && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("transportInfo.driverId")}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Stack p={2} gap={2}>
              <Stack gap={1}>
                <InputLabel className="text-sm text-muted-foreground">
                  Description
                </InputLabel>

                <FormControl fullWidth>
                  <TextareaAutosize
                    id="additionalInfo"
                    minRows={8}
                    placeholder="Provide additional information"
                    style={{
                      width: "100%",
                      border: "1px solid",
                      borderColor: "var(--mui-palette-divider)",
                      borderRadius: "4px",
                      padding: "16px 8px",
                    }}
                    {...register("additionalInfo")}
                  />
                </FormControl>
              </Stack>

              <Stack gap={1}>
                <InputLabel className="text-sm text-muted-foreground">
                  Supporting Documents
                </InputLabel>

                {isUploading && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                )}

                {formData.supportingDocuments?.map(({ name = "" }, index) => (
                  <Stack
                    key={`${name || index}`}
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
                      <Typography variant="body2">{name}</Typography>
                    </Stack>
                    <IconButton
                      disabled={isSubmitting}
                      size="small"
                      className="max-w-[24px] max-h-[24px]"
                      color="error"
                      onClick={() => handleDeleteFile(name, index)}
                    >
                      <DeleteOutline className="max-w-4 max-h-4" />
                    </IconButton>
                  </Stack>
                ))}

                {errors?.supportingDocuments?.message && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.supportingDocuments.message as string}
                  </Typography>
                )}
                <div ref={supportingDocumentsRef}></div>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box p={2} gap={2} display="flex" justifyContent="space-between">
          <Button
            disabled={isSubmitting}
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
              disabled={isSubmitting || isUploading}
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
