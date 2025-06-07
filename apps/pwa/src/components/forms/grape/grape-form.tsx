/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGrape } from "@/context/grape";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { grapeSchema } from "@/models/schemas/grape-schema";
import { DbResponse, FormMode, Grape } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Accordion,
  AccordionDetails,
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField as Input,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import {
  CONCENTRATION_UNITS,
  DENSITY_UNITS,
  MASS_UNITS,
} from "@/data/constants";

export type GrapeFormProps = {
  children?: React.ReactNode;
  grape?: Grape;
  closeDrawer?: () => void;
  type?: FormMode;
};

export default function GrapeForm({
  grape,
  closeDrawer,
  type = "create",
}: GrapeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { grapes } = useGrape();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Grape>({
    resolver: joiResolver(grapeSchema),
  });

  const [formData, setFormData] = useState<Grape | undefined>(grape);

  const handleSelectChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Grape, value);
      setFormData((prev) => ({ ...(prev as Grape), [name]: value }));
    },
    [setValue]
  );

  const handleCreateGrape = useCallback(
    async (uid: string, data: any) => {
      if (type === "create") {
        data.group = [data.name];
        data.rowType = "item";
      }

      try {
        const getOneRes: DbResponse = await db.grape.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const {
            grossWeight,
            grossUnit,
            netWeight,
            netUnit,
            tareWeight,
            tareUnit,
          } = data?.entry;

          const entry = {
            ...data?.entry,
            ...(grossWeight
              ? { grossWeight, grossUnit }
              : { grossWeight: undefined, grossUnit: undefined }),
            ...(netWeight
              ? { netWeight, netUnit }
              : { netWeight: undefined, netUnit: undefined }),
            ...(tareWeight
              ? { tareWeight, tareUnit }
              : { tareWeight: undefined, tareUnit: undefined }),
          };

          const { density, temperature, sugar, acidity } = data?.labData;

          const labData = {
            ...data?.labData,
            density: {
              ...density,
              value: density?.value,
              unit: density?.value != null ? density.unit : undefined,
            },
            temperature: {
              ...temperature,
              value: temperature?.value,
              unit: temperature?.value != null ? temperature.unit : undefined,
            },
            sugar: {
              ...sugar,
              value: sugar?.value,
              unit: sugar?.value != null ? sugar.unit : undefined,
            },
            acidity: {
              ...acidity,
              value: acidity?.value,
              unit: acidity?.value != null ? acidity.unit : undefined,
            },
          };

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
            entry,
            labData,
          };

          const updateRes: DbResponse = await db.grape.update(uid, id, newData);

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer?.();
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

            closeDrawer?.();
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
    [closeDrawer, enqueueSnackbar, formData?.group, type]
  );

  const onSubmit = async (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleCreateGrape(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const name = `BatchID_${grapes?.length + 1}`;

    const formatted = {
      ...grape,
      ...(!grape && {
        id: Date.now().toString(),
        name,
        group: [name],
      }),
      entry: {
        ...grape?.entry,
        grossUnit: grape?.entry?.grossUnit || MASS_UNITS[0] || "kg",
        netUnit: grape?.entry?.netUnit || MASS_UNITS[0] || "kg",
        tareUnit: grape?.entry?.tareUnit || MASS_UNITS[0] || "kg",
      },
      labData: {
        ...grape?.labData,
        density: {
          ...grape?.labData?.density,
          unit: grape?.labData?.density?.unit || DENSITY_UNITS[0] || "kg/L",
        },
        temperature: {
          ...grape?.labData?.temperature,
          unit: grape?.labData?.temperature?.unit || "°C",
        },
        sugar: {
          ...grape?.labData?.sugar,
          unit:
            grape?.labData?.sugar?.unit || CONCENTRATION_UNITS[0] || "g/dm³",
        },
        acidity: {
          ...grape?.labData?.acidity,
          unit:
            grape?.labData?.acidity?.unit || CONCENTRATION_UNITS[0] || "g/dm³",
        },
      },
    } as Grape;

    reset(formatted);
    setFormData(formatted);
  }, [reset, grape, grapes?.length]);

  useEffect(() => {
    if (errors) {
      console.log("[VESSEL FORM ERRORS]", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div style={{ background: "var(--mui-palette-background-default)" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <Accordion defaultExpanded>
                <AccordionDetails>
                  <div className="p-4 flex flex-col gap-4 border-l">
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
                        Enter date
                      </InputLabel>

                      <DatePicker
                        label="Date"
                        value={
                          formData?.date
                            ? dayjs(parseToDate(formData?.date))
                            : null
                        }
                        onChange={(newValue) =>
                          handleSelectChange(
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
                        Enter product name
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="name"
                          label="Product name"
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
                        Enter grape variety
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="grapeVariety"
                          label="Grape variety"
                          type="text"
                          variant="outlined"
                          {...register("grapeVariety")}
                        />
                      </FormControl>
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

                    <Typography>Mass</Typography>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter gross weight
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="entry.grossWeight"
                            label="Gross weight"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("entry.grossWeight", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {MASS_UNITS.length === 1 ? (
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
                        )}
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

                      {errors?.entry?.grossUnit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.entry?.grossUnit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter tare weight
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="entry.tareWeight"
                            label="Tare weight"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("entry.tareWeight", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {MASS_UNITS.length === 1 ? (
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
                              handleSelectChange(
                                "entry.tareUnit",
                                newInputValue
                              );
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
                        )}
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

                      {errors?.entry?.tareUnit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.entry?.tareUnit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter net weight
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="entry.netWeight"
                            label="Net weight"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("entry.netWeight", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {MASS_UNITS.length === 1 ? (
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
                              handleSelectChange(
                                "entry.netUnit",
                                newInputValue
                              );
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
                        )}
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

                      {errors?.entry?.netUnit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.entry?.netUnit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter Certificat de Inofensivitate
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="transportationInfo.certificate"
                          label="Certificat de Inofensivitate"
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
                        Enter Invoice/purchase document number
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="transportationInfo.acquisitionInvoiceNo"
                          label="Invoice/purchase document number"
                          type="text"
                          variant="outlined"
                          {...register(
                            "transportationInfo.acquisitionInvoiceNo"
                          )}
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
                        Enter name of the weighbridge operator
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="entry.weigherName"
                          label="Name of the weighbridge operator"
                          type="text"
                          variant="outlined"
                          {...register("entry.weigherName")}
                        />
                      </FormControl>
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

                    <Typography>Quality characteristics</Typography>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter density
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.density.value"
                            label="Density"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("labData.density.value", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {DENSITY_UNITS.length === 1 ? (
                          <Box sx={{ width: "40px" }}>
                            {formData?.labData?.density?.unit}
                          </Box>
                        ) : (
                          <Autocomplete
                            freeSolo
                            options={DENSITY_UNITS}
                            value={
                              formData?.labData?.density?.unit ??
                              DENSITY_UNITS[0]
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
                        )}
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

                      {errors?.labData?.density?.unit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.labData?.density?.unit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter sample temperature
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.temperature.value"
                            label="Sample temperature"
                            variant="outlined"
                            type="number"
                            slotProps={{
                              htmlInput: { min: 0, step: "any", max: 100 },
                            }}
                            {...register("labData.temperature.value", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>
                        <FormControl sx={{ width: "100px", display: "none" }}>
                          <Input
                            id="labData.temperature.unit"
                            label="Unit"
                            type="hidden"
                            variant="outlined"
                            value={formData?.labData?.temperature?.unit || "°C"}
                            {...register("labData.temperature.unit")}
                          />
                        </FormControl>

                        <Box sx={{ width: "40px" }}>
                          {formData?.labData?.temperature?.unit || "°C"}
                        </Box>
                      </Stack>

                      {errors?.labData?.temperature?.value && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            errors?.labData?.temperature?.value
                              ?.message as string
                          }
                        </Typography>
                      )}

                      {errors?.labData?.temperature?.unit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {
                            errors?.labData?.temperature?.unit
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter mass concentration of sugars
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.sugar.value"
                            label="Mass concentration of sugars"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("labData.sugar.value", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {CONCENTRATION_UNITS.length === 1 ? (
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
                              handleSelectChange(
                                "labData.sugar.unit",
                                newValue
                              );
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
                        )}
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

                      {errors?.labData?.sugar?.unit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.labData?.sugar?.unit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter acidity:
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.acidity.value"
                            label="Acidity"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("labData.acidity.value", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {CONCENTRATION_UNITS.length === 1 ? (
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
                        )}
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

                      {errors?.labData?.acidity?.unit && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.labData?.acidity?.unit?.message as string}
                        </Typography>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <InputLabel
                        className="text-sm text-muted-foreground"
                        sx={{ whiteSpace: "wrap" }}
                      >
                        Enter mass fraction of grapes affected by diseases and
                        pests
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.spoiledGrapesPercentage"
                            label="Mass fraction of grapes affected by diseases and pests"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("labData.spoiledGrapesPercentage", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        <Box sx={{ width: "40px" }}>%</Box>
                      </Stack>

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
                        Enter mass fraction of crushed grapes
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.crushedGrapesPercentage"
                            label="Mass fraction of crushed grapes"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register("labData.crushedGrapesPercentage", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        <Box sx={{ width: "40px" }}>%</Box>
                      </Stack>

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
                        Enter mass fraction of mixed grape varieties
                      </InputLabel>

                      <Stack direction="row" gap={2} alignItems="center">
                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="labData.addedGrapesVarietiesPercentage"
                            label="Mass fraction of mixed grape varieties"
                            variant="outlined"
                            type="number"
                            slotProps={{ htmlInput: { min: 0, step: "any" } }}
                            {...register(
                              "labData.addedGrapesVarietiesPercentage",
                              {
                                setValueAs: (value) =>
                                  value === "" ? undefined : parseFloat(value),
                              }
                            )}
                          />
                        </FormControl>

                        <Box sx={{ width: "40px" }}>%</Box>
                      </Stack>

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
                        Enter lab technician name
                      </InputLabel>

                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.labTechnicianName"
                          label="Lab technician name"
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
                          {
                            errors?.labData?.labTechnicianName
                              ?.message as string
                          }
                        </Typography>
                      )}
                    </div>
                  </div>
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
                position: "sticky",
                borderTop: "1px solid #ccc",
                background: "var(--mui-palette-background-default)",
              }}
            >
              <FormControl>
                <Button disabled={isSubmitting} onClick={() => closeDrawer?.()}>
                  Cancel
                </Button>
              </FormControl>

              <FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </FormControl>
            </Box>
          </form>
        </div>
      )}
    </>
  );
}
