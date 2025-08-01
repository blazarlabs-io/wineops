/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMust } from "@/context/must";
import { useVessel } from "@/context/vessel";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { mustSchema } from "@/models/schemas/must-schema";
import { DbResponse, FormMode, Must, MustStatus } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { joiResolver } from "@hookform/resolvers/joi";
import { ExpandMore } from "@mui/icons-material";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { getResultsWithUnits } from "../utils";

export default function MustForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { vessels } = useVessel();
  const { musts } = useMust();
  const existingMust = musts.find(({ id }) => id === selected[0]?.id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<Must>({
    resolver: joiResolver(mustSchema, { stripUnknown: true }),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [formData, setFormData] = useState<Must | undefined>();

  const handleSelectChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Must, value);
      setFormData((prev) => ({ ...(prev as Must), [name]: value }));
    },
    [setValue],
  );

  const handleCreateMust = useCallback(
    async (uid: string, data: Must) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";
        data.status = MustStatus.NEW_MUST;
      }

      try {
        const getOneRes: DbResponse = await db.must.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
            status: data?.status || MustStatus.NEW_MUST,
          };

          const updateRes: DbResponse = await db.must.update(uid, id, newData);

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error updating must`, {
              variant: "error",
            });
          }
        } else {
          const labReportId = crypto.randomUUID();

          if (data.labDataOld) {
            const results = getResultsWithUnits(data.labDataOld);

            const labRes = await db.labReport.create(uid, {
              id: labReportId,
              subject: {
                id: data.id,
                name: data.name,
              },
              date: data.labDataOld.date,
              results,
            });

            if (labRes.status === 200) {
              data.labData = [
                {
                  id: labReportId,
                  name: "lab-results",
                  date: data.labDataOld.date,
                },
              ];
              enqueueSnackbar("Lab results created", { variant: "success" });
            } else {
              enqueueSnackbar("Error creating lab results", {
                variant: "error",
              });
            }
          }

          data.group = [data.name];

          const createRes: DbResponse = await db.must.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating must`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e,
        );

        enqueueSnackbar(`Error creating must`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType],
  );

  const onSubmit = async (data: Must) => {
    setIsSubmitting(true);

    try {
      await handleCreateMust(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const name = `Must_${musts?.filter(({ rowType }) => rowType !== "group")?.length + 1}`;

    const formatted = {
      ...existingMust,
      ...(!existingMust && {
        id: crypto.randomUUID(),
        name,
      }),
      status: existingMust?.status || MustStatus.NEW_MUST,
    } as Must;

    reset(formatted);
    setFormData(formatted);
  }, [reset, existingMust, musts]);

  useEffect(() => {
    if (errors) {
    }
  }, [errors]);

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
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Accordion defaultExpanded disableGutters={true}>
              <AccordionDetails>
                <Stack gap={2}>
                  <div className="hidden">
                    <FormControl>
                      <Input
                        id={formData?.id as Must["id"]}
                        value={formData?.id || ""}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
                  </div>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter date:
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
                            : undefined,
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter batch name:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="name"
                        label="Batch name"
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter supplier name:
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter grape variety:
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
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter quantity
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="qty"
                        label="Quantity (dal)"
                        type="number"
                        variant="outlined"
                        {...register("qty")}
                      />
                    </FormControl>

                    {errors?.qty && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.qty?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Select vessels used:
                    </InputLabel>

                    <Autocomplete
                      multiple
                      noOptionsText="No vessels available"
                      options={vessels.filter(
                        (vessel) =>
                          vessel.rowType !== "group" &&
                          !formData?.vessels?.some(
                            ({ id }) => id === vessel.id,
                          ),
                      )}
                      value={[]}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        const added = newValue.at(-1);
                        if (!added) return;
                        const updated = [
                          ...(formData?.vessels ?? []),
                          { ...added, qty: 1 },
                        ];
                        handleSelectChange("vessels", updated);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Add vessel"
                        />
                      )}
                    />

                    {(formData?.vessels || []).length > 0 && (
                      <Stack
                        p={2}
                        pb={1}
                        gap={1}
                        sx={{
                          border: "1px solid var(--mui-palette-divider)",
                        }}
                      >
                        {formData?.vessels?.map(
                          ({ id, name, qty = "" }, index) => (
                            <Fragment key={id}>
                              <Stack
                                gap={1}
                                key={id}
                                direction="row"
                                alignItems="center"
                              >
                                <Typography
                                  variant="body2"
                                  component="div"
                                  sx={{ flex: 1 }}
                                >
                                  {name}
                                </Typography>

                                <FormControl>
                                  <Input
                                    id="qty"
                                    size="small"
                                    label="Qty"
                                    type="number"
                                    variant="outlined"
                                    value={qty}
                                    slotProps={{
                                      htmlInput: { min: 1, step: "any" },
                                    }}
                                    sx={{ width: "80px" }}
                                    onChange={(e) => {
                                      const updated = [
                                        ...(formData.vessels || []),
                                      ];
                                      updated[index].qty = Number(
                                        e.target.value,
                                      );
                                      handleSelectChange("vessels", updated);
                                    }}
                                  />
                                </FormControl>

                                <IconButton
                                  size="small"
                                  disabled={false}
                                  onClick={() => {
                                    const updated = formData.vessels?.filter(
                                      (vessel) => vessel.id !== id,
                                    );
                                    handleSelectChange("vessels", updated);
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </Stack>

                              <Typography
                                key={index}
                                variant="body2"
                                color="error"
                                className="mt-1"
                              >
                                {errors?.vessels &&
                                  Array.isArray(errors?.vessels) &&
                                  (errors?.vessels[index]?.qty
                                    ?.message as string)}
                              </Typography>
                            </Fragment>
                          ),
                        )}
                      </Stack>
                    )}

                    {errors?.vessels && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.vessels?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter safety certificate number:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="safetyCertificateNo"
                        label="Safety certificate number"
                        type="text"
                        variant="outlined"
                        {...register("safetyCertificateNo")}
                      />
                    </FormControl>

                    {errors?.safetyCertificateNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.safetyCertificateNo?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter invoice/purchase document number:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="invoicePurchaseNo"
                        label="Invoice/purchase document number"
                        type="text"
                        variant="outlined"
                        {...register("invoicePurchaseNo")}
                      />
                    </FormControl>

                    {errors?.invoicePurchaseNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.invoicePurchaseNo?.message as string}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="quality-characteristics-content"
                id="quality-characteristics-header"
              >
                <Typography component="span">
                  Quality characteristics
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter date:
                    </InputLabel>

                    <Controller
                      name="labDataOld.date"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <DatePicker
                            label="Date"
                            value={
                              field.value
                                ? dayjs(parseToDate(field.value))
                                : null
                            }
                            disableFuture
                            views={["year", "month", "day"]}
                            onChange={(newValue) =>
                              field.onChange(
                                newValue
                                  ? Timestamp.fromDate(newValue.toDate())
                                  : null,
                              )
                            }
                          />
                          {fieldState.error && (
                            <Typography
                              variant="body2"
                              color="error"
                              className="mt-1"
                            >
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </>
                      )}
                    />

                    {errors?.labDataOld?.date && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labDataOld?.date?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the temperature (°C):
                    </InputLabel>

                    <FormControl sx={{ flex: 1 }}>
                      <Input
                        id="labDataOld.temperature.value"
                        label="Temperature (°C)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: -20, step: 0.01, max: 100 },
                          inputLabel: {
                            ...((formData?.labDataOld?.temperature?.value ||
                              0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.temperature.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.temperature?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.labDataOld?.temperature?.value
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the alcohol (%):
                    </InputLabel>
                    <FormControl sx={{ flex: 1 }}>
                      <Input
                        id="labDataOld.alcohol"
                        label="Alcohol (%)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100 },
                          inputLabel: {
                            ...((formData?.labDataOld?.alcohol?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.alcohol.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.alcohol?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.alcohol.value.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel
                      className="text-sm text-muted-foreground"
                      sx={{ whiteSpace: "normal" }}
                    >
                      Enter the mass concentration of sugars (g/dm³):
                    </InputLabel>

                    <FormControl sx={{ flex: 1 }}>
                      <Input
                        id="labDataOld.sugar.value"
                        label="Sugar (g/dm³)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000 },
                          inputLabel: {
                            ...((formData?.labDataOld?.sugar?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.sugar.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.sugar?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labDataOld?.sugar?.value?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the acidity (g/dm³):
                    </InputLabel>

                    <FormControl sx={{ flex: 1 }}>
                      <Input
                        id="labDataOld.acidity.value"
                        label="Acidity (g/dm³)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000 },
                          inputLabel: {
                            ...((formData?.labDataOld?.acidity?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.acidity.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.acidity?.value && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labDataOld?.acidity?.value?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the pH:
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="pH"
                        label="pH"
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 0.01,
                            max: 14,
                          },
                          inputLabel: {
                            ...((formData?.labDataOld?.pH?.value || 0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.pH.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.pH?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.pH.value.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the density (g/cm³):
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="density"
                        label="Density (g/cm³)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 0.01,
                            max: 10_000,
                          },
                          inputLabel: {
                            ...((formData?.labDataOld?.density?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.density.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.density?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.density.value.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the volatile acidity (g/L):
                    </InputLabel>

                    <FormControl sx={{ flex: 1 }}>
                      <Input
                        id="labDataOld.volatileAcidity"
                        label="Volatile acidity (g/L)"
                        variant="outlined"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 10_000 },
                          inputLabel: {
                            ...((formData?.labDataOld?.volatileAcidity?.value ||
                              0) > 0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.volatileAcidity.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.volatileAcidity?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors.labDataOld.volatileAcidity.value
                            .message as string
                        }
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the malic acid (g/L):
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="malicAcid"
                        label="Malic acid (g/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 0.01,
                            max: 10_000,
                          },
                          inputLabel: {
                            ...((formData?.labDataOld?.malicAcid?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.malicAcid.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.malicAcid?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labDataOld?.malicAcid?.value.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lactic acid (g/L):
                    </InputLabel>

                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="lacticAcid"
                        label="Lactic acid (g/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 0.01,
                            max: 10_000,
                          },
                          inputLabel: {
                            ...((formData?.labDataOld?.lacticAcid?.value || 0) >
                              0 && {
                              shrink: true,
                            }),
                          },
                        }}
                        {...register("labDataOld.lacticAcid.value")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.lacticAcid?.value?.message && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.lacticAcid.value.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab technician name:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labDataOld.labTechnicianName"
                        label="Lab technician name"
                        type="text"
                        variant="outlined"
                        {...register("labDataOld.labTechnicianName")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.labTechnicianName && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.labTechnicianName?.message as string}
                      </Typography>
                    )}
                  </Stack>

                  <Stack gap={1}>
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter the lab certificate ID:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labDataOld.labCertificateID"
                        label="Lab certificate ID"
                        type="text"
                        variant="outlined"
                        {...register("labDataOld.labCertificateID")}
                      />
                    </FormControl>

                    {errors?.labDataOld?.labCertificateID && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labDataOld.labCertificateID?.message as string}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
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
