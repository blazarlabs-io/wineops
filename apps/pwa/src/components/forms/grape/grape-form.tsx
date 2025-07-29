/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGrape } from "@/context/grape";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { grapeSchema } from "@/models/schemas/grape-schema";
import {
  DbResponse,
  FormMode,
  Grape,
  GrapeStatus,
  SingleDocument,
  TeamMember,
} from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField as Input,
  InputLabel,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
  useColorScheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { ExpandMore } from "@mui/icons-material";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { hasKeyFromArray } from "../utils";
import FileUploaderField from "../custom-fields/file-uploader-field";
import { useWinery } from "@/context/winery";

export default function GrapeForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const { teamMembers } = useWinery();
  const { enqueueSnackbar } = useSnackbar();
  const { mode } = useColorScheme();
  const [generalExpanded, setGeneralExpanded] = useState<boolean>(true);
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);
  const [parametersExpanded, setParametersExpanded] = useState<boolean>(false);
  const [transportationInfoExpanded, setTransportationInfoExpanded] =
    useState<boolean>(false);
  const [additionalInfoExpanded, setAdditionalInfoExpanded] =
    useState<boolean>(false);

  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleGeneralExpansion = () => {
    setGeneralExpanded((prevExpanded) => !prevExpanded);
  };

  const handleDetailsExpansion = () => {
    setDetailsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleParametersExpansion = () => {
    setParametersExpanded((prevExpanded) => !prevExpanded);
  };

  const handleTransportationInfoExpansion = () => {
    setTransportationInfoExpanded((prevExpanded) => !prevExpanded);
  };

  const handleAdditionalInfoExpansion = () => {
    setAdditionalInfoExpanded((prevExpanded) => !prevExpanded);
  };

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { grapes } = useGrape();

  const existingGrape = grapes?.find(
    ({ id }) => id === selected[0]?.id
  ) as Grape;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Grape>({
    resolver: joiResolver(grapeSchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Grape | undefined>();

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Grape, value);
      setFormData((prev) => ({ ...(prev as Grape), [name]: value }));
    },
    [setValue]
  );

  const onDocumentUpload = useCallback(
    (data: any) => {
      console.log(
        "onDocumentUpload",
        ...(formData?.documents as SingleDocument[]),
        data
      );
      const newSingleDocument = {
        id: crypto.randomUUID(),
        name: data.name,
        fileUrl: data.fileUrl,
        owner: teamMembers.find(({ id }) => id === user?.uid) as TeamMember,
        uploadDate: Timestamp.now(),
        media: data.media.type,
      };
      handleChange("documents", [
        ...(formData?.documents as SingleDocument[]),
        newSingleDocument,
      ]);
    },
    [formData?.documents, handleChange, teamMembers, user?.uid]
  );

  const handleCreateGrape = useCallback(
    async (uid: string, data: any) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";
      }

      try {
        const getOneRes: DbResponse = await db.grape.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
          };

          const updateRes: DbResponse = await db.grape.update(uid, id, newData);

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error updating grape`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.grape.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating grape`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e
        );

        enqueueSnackbar(`Error creating grape`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType]
  );

  const onSubmit = async (data: Grape) => {
    setIsSubmitting(true);

    console.log("[SUBMIT GRAPE FORM]", data);

    try {
      await handleCreateGrape(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const name = `BatchID_${grapes?.filter(({ rowType }) => rowType !== "group")?.length + 1}`;

    const formatted = {
      ...{
        id: crypto.randomUUID(),
        name,
        status: GrapeStatus.NEW,
      },
      ...existingGrape,
    } as Grape;

    reset(formatted);
    setFormData(formatted);
  }, [existingGrape, grapes, reset]);

  useEffect(() => {
    if (errors) {
      console.log("[GRAPE FORM ERRORS]", errors);

      const hasGeneralErrors = hasKeyFromArray(
        ["date", "supplier", "name", "variety"],
        errors
      );

      if (hasGeneralErrors) setGeneralExpanded(hasGeneralErrors);

      const hasDetailsErrors = hasKeyFromArray(
        ["entry", "transportationInfo", "weigherName"],
        errors
      );

      if (hasDetailsErrors) setDetailsExpanded(hasDetailsErrors);

      const hasParametersErrors = hasKeyFromArray(["labData"], errors);

      if (hasParametersErrors) setParametersExpanded(hasParametersErrors);
    }
  }, [errors]);

  if (!formData) return null;

  return (
    <>
      <Stack
        sx={{
          background: "var(--mui-palette-background-default)",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
            <Accordion
              sx={{
                background:
                  mode === "dark" ? "#121212 !important" : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              defaultExpanded
              disableGutters={true}
              expanded={generalExpanded}
              onChange={handleGeneralExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="general-info-content"
                id="general-info-header"
              >
                <Typography component="span">General Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="flex flex-col gap-4">
                  <div className="hidden">
                    <FormControl>
                      <Input
                        id={formData.id as Grape["id"]}
                        value={formData.id}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select date
                    </InputLabel>

                    <DatePicker
                      label="Date"
                      value={
                        formData?.date
                          ? dayjs(parseToDate(formData?.date))
                          : null
                      }
                      onChange={(newValue) =>
                        handleChange(
                          "date",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : null
                        )
                      }
                    />

                    {errors?.date && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.date?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the supplier name
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

                    {errors?.supplier?.companyName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.supplier?.companyName?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the Batch ID
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="name"
                        label="Batch ID"
                        type="text"
                        variant="outlined"
                        {...register("name")}
                      />
                    </FormControl>

                    {errors?.name && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.name?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
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
                          label="Grape Variety"
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
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background:
                  mode === "dark" ? "#121212 !important" : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters={true}
              expanded={detailsExpanded}
              onChange={handleDetailsExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="details-content"
                id="details-header"
              >
                <Typography component="span">Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter gross weight (Kg)
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="entry.grossWeight"
                          label="Gross weight (Kg)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                          }}
                          {...register("entry.grossWeight", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{MASS_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.entry?.grossUnit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={MASS_UNITS}
                          value={formData?.entry?.grossUnit || MASS_UNITS[0]}
                          onChange={(_event, newValue) => {
                            handleSelectChange("entry.grossUnit", newValue);
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange(
                              "entry.grossUnit",
                              newInputValue
                            );
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Gross unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.entry?.grossWeight && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.grossWeight?.message as string}
                      </Typography>
                    )}

                    {/*{errors?.entry?.grossUnit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.grossUnit?.message as string}
                      </Typography>
                    )}*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter tare weight (Kg)
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="entry.tareWeight"
                          label="Tare weight (Kg)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                          }}
                          {...register("entry.tareWeight", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{MASS_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.entry?.tareUnit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={MASS_UNITS}
                          value={formData?.entry?.tareUnit ?? MASS_UNITS[0]}
                          onChange={(_event, newValue) => {
                            handleSelectChange("entry.tareUnit", newValue);
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange("entry.tareUnit", newInputValue);
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Tare unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.entry?.tareWeight && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.tareWeight?.message as string}
                      </Typography>
                    )}

                    {/*{errors?.entry?.tareUnit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.tareUnit?.message as string}
                      </Typography>
                    )}*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter net weight (Kg)
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="entry.netWeight"
                          label="Net weight (Kg)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                          }}
                          {...register("entry.netWeight", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{MASS_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.entry?.netUnit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={MASS_UNITS}
                          value={formData?.entry?.netUnit ?? MASS_UNITS[0]}
                          onChange={(_event, newValue) => {
                            handleSelectChange("entry.netUnit", newValue);
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange("entry.netUnit", newInputValue);
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Net unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.entry?.netWeight && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.netWeight?.message as string}
                      </Typography>
                    )}

                    {/*{errors?.entry?.netUnit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry?.netUnit?.message as string}
                      </Typography>
                    )}*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the Certificat de inofensivitate ID
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.certificate"
                        label="Certificat de inofensivitate ID"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.certificate")}
                      />
                    </FormControl>

                    {errors?.transportationInfo?.certificate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.certificate
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the Invoice ID
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="supplier.invoiceNo"
                        label="Invoice ID"
                        type="text"
                        variant="outlined"
                        {...register("supplier.invoiceNo")}
                      />
                    </FormControl>

                    {errors?.supplier?.invoiceNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.supplier?.invoiceNo?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the weighbridge operator name
                    </InputLabel>

                    <Autocomplete
                      freeSolo
                      options={[]}
                      value={formData?.entry?.weigherName || ""}
                      onChange={(_event, newValue) => {
                        handleChange("entry.weigherName", newValue);
                      }}
                      onInputChange={(_event, newInputValue) => {
                        handleChange("entry.weigherName", newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Operator name"
                          variant="outlined"
                        />
                      )}
                    />
                    {errors?.entry?.weigherName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.entry.weigherName?.message as string}
                      </Typography>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background:
                  mode === "dark" ? "#121212 !important" : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters={true}
              expanded={parametersExpanded}
              onChange={handleParametersExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="quality-parameters-content"
                id="quality-parameters-header"
              >
                <Typography component="span">Quality Parameters</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the sample temperature (°C)
                    </InputLabel>
                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.temperature.value"
                          label="Sample temperature (°C)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1000 },
                          }}
                          {...register("labData.temperature.value", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>
                    </Stack>
                    {errors?.labData?.temperature?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.temperature?.value?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the density (Kg/L)
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.density.value"
                          label="Density (Kg/L)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1000 },
                          }}
                          {...register("labData.density.value", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{DENSITY_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.labData?.density?.unit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={DENSITY_UNITS}
                          value={
                            formData?.labData?.density?.unit ?? DENSITY_UNITS[0]
                          }
                          onChange={(_event, newValue) => {
                            handleSelectChange(
                              "labData.density.unit",
                              newValue
                            );
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange(
                              "labData.density.unit",
                              newInputValue
                            );
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.labData?.density?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.density?.value?.message as string}
                      </Typography>
                    )}

                    {/*{errors?.labData?.density?.unit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.density?.unit?.message as string}
                      </Typography>
                    )}*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter mass concentration of sugars (g/dm³)
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.sugar.value"
                          label="Sugar (g/dm³)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 10_000 },
                          }}
                          {...register("labData.sugar.value", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{CONCENTRATION_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.labData?.sugar?.unit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={CONCENTRATION_UNITS}
                          value={
                            formData?.labData?.sugar?.unit ??
                            CONCENTRATION_UNITS[0]
                          }
                          onChange={(_event, newValue) => {
                            handleSelectChange("labData.sugar.unit", newValue);
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange(
                              "labData.sugar.unit",
                              newInputValue
                            );
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.labData?.sugar?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.sugar?.value?.message as string}
                      </Typography>
                    )}

                    {/*{errors?.labData?.sugar?.unit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.sugar?.unit?.message as string}
                      </Typography>
                    )}*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter acidity (g/dm³):
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.acidity.value"
                          label="Acidity (g/dm³)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 10_000 },
                          }}
                          {...register("labData.acidity.value", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      {/*{CONCENTRATION_UNITS.length === 1 ? (
                        <Box sx={{ width: "40px" }}>
                          {formData?.labData?.acidity?.unit}
                        </Box>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={CONCENTRATION_UNITS}
                          value={
                            formData?.labData?.acidity?.unit ??
                            CONCENTRATION_UNITS[0]
                          }
                          onChange={(_event, newValue) => {
                            handleSelectChange(
                              "labData.acidity.unit",
                              newValue
                            );
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange(
                              "labData.acidity.unit",
                              newInputValue
                            );
                          }}
                          sx={{ width: "100px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Unit"
                              variant="outlined"
                            />
                          )}
                        />
                      )}*/}
                    </Stack>

                    {errors?.labData?.acidity?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.acidity?.value?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel
                      className="text-sm text-muted-foreground"
                      sx={{ whiteSpace: "wrap" }}
                    >
                      Enter mass fraction of grapes affected by diseases and
                      pests (%)
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labData.spoiledGrapesPercentage"
                        label="Affected grapes (%)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register("labData.spoiledGrapesPercentage", {
                          setValueAs: (value) =>
                            value === "" ? undefined : parseFloat(value),
                        })}
                      />
                    </FormControl>

                    {errors?.labData?.spoiledGrapesPercentage && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.labData?.spoiledGrapesPercentage
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter mass fraction of crushed grapes (%)
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labData.crushedGrapesPercentage"
                        label="Crushed grapes %"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register("labData.crushedGrapesPercentage", {
                          setValueAs: (value) =>
                            value === "" ? undefined : parseFloat(value),
                        })}
                      />
                    </FormControl>

                    {errors?.labData?.crushedGrapesPercentage && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.labData?.crushedGrapesPercentage
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter mass fraction of mixed grape varieties (%)
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labData.addedGrapesVarietiesPercentage"
                        label="Mixed grapes (%)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                        }}
                        {...register("labData.addedGrapesVarietiesPercentage", {
                          setValueAs: (value) =>
                            value === "" ? undefined : parseFloat(value),
                        })}
                      />
                    </FormControl>

                    {errors?.labData?.addedGrapesVarietiesPercentage && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.labData?.addedGrapesVarietiesPercentage
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab certificate ID
                    </InputLabel>
                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.labCertificateID"
                          label="Lab certificate ID"
                          variant="outlined"
                          slotProps={{
                            htmlInput: { minLength: 2, maxLength: 50 },
                          }}
                          {...register("labData.labCertificateID", {
                            setValueAs: (value) =>
                              value === "" ? undefined : value,
                          })}
                        />
                      </FormControl>
                    </Stack>
                    {errors?.labData?.temperature?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.temperature?.value?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab technician name
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labData.labTechnicianName"
                        label="Technician name"
                        type="text"
                        variant="outlined"
                        {...register("labData.labTechnicianName")}
                      />
                    </FormControl>

                    {errors?.labData?.labTechnicianName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.labTechnicianName?.message as string}
                      </Typography>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                background:
                  mode === "dark" ? "#121212 !important" : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters={true}
              expanded={transportationInfoExpanded}
              onChange={handleTransportationInfoExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="details-content"
                id="details-header"
              >
                <Typography component="span">Transportation Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select the processing location
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.processingLocation"
                        label="Processing Location"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.processingLocation")}
                      />
                    </FormControl>

                    {errors?.labData?.labTechnicianName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.processingLocation
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the dispatch invoice
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.acquisitionInvoiceNo"
                        label="Dispatch Invoice"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.acquisitionInvoiceNo")}
                      />
                    </FormControl>

                    {errors?.transportationInfo?.acquisitionInvoiceNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.acquisitionInvoiceNo
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the transportation company name
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.companyName"
                        label="Company name"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.companyName")}
                      />
                    </FormControl>

                    {errors?.transportationInfo?.companyName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.companyName
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the vehicle registration number
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.vehicleIdNo"
                        label="Vehicle number"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.vehicleIdNo")}
                      />
                    </FormControl>

                    {errors?.transportationInfo?.vehicleIdNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.vehicleIdNo
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the driver name
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="transportationInfo.driverIdNo"
                        label="Driver name"
                        type="text"
                        variant="outlined"
                        {...register("transportationInfo.driverIdNo")}
                      />
                    </FormControl>

                    {errors?.transportationInfo?.driverIdNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.transportationInfo?.driverIdNo
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            {/* * ADDITIONAL INFORMATION */}
            <Accordion
              sx={{
                background:
                  mode === "dark" ? "#121212 !important" : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters={true}
              expanded={additionalInfoExpanded}
              onChange={handleAdditionalInfoExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span">Additional Information</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1">Description</Typography>
                <TextareaAutosize
                  minRows={8}
                  placeholder="Description or additional information..."
                  style={{
                    width: "100%",
                    border: "1px solid",
                    borderColor: "var(--mui-palette-divider)",
                    borderRadius: "4px",
                    padding: "16px 8px",
                  }}
                  value={formData?.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                <FileUploaderField
                  path="documents"
                  data={formData.documents}
                  onFileData={onDocumentUpload}
                />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box
            p={2}
            gap={2}
            display="flex"
            justifyContent="end"
            sx={{
              bottom: 0,
              zIndex: 1,
              flexShrink: 0,
              position: "sticky",
              borderTop: "1px solid #ccc",
              background: "var(--mui-palette-background-default)",
            }}
          >
            <FormControl>
              <Button disabled={isSubmitting} onClick={closeDrawer}>
                Cancel
              </Button>
            </FormControl>

            <FormControl>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
            </FormControl>
          </Box>
        </form>
      </Stack>
    </>
  );
}
