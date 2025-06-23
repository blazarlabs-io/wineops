/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useVessel } from "@/context/vessel";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { wineSchema } from "@/models/schemas/wine-schema";
import {
  DbResponse,
  FormMode,
  GrapeVariety,
  MustWineVessel,
  Wine,
  WineStatus,
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
import { ExpandMore } from "@mui/icons-material";
import { CONCENTRATION_UNITS } from "@/data/constants";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useWine } from "@/context/wine";

export default function WineForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const closeDialog = useDialogDrawerStore(({ closeDialog }) => closeDialog);

  const closeDrawer = useCallback(
    () => closeDialog("form-drawer"),
    [closeDialog]
  );

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const [workingWine, setWorkingWine] = useState<Wine | undefined>();

  const { wines } = useWine();

  const { vessels } = useVessel();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<Wine>({
    resolver: joiResolver(wineSchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Wine | undefined>(workingWine);

  const handleSelectChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Wine, value);
      setFormData((prev) => ({ ...(prev as Wine), [name]: value }));
    },
    [setValue]
  );

  const handleCreateWine = useCallback(
    async (uid: string, data: Wine) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";
        data.status = WineStatus.NEW_WINE;
      }

      try {
        const getOneRes: DbResponse = await db.wine.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
            status: data?.status || WineStatus.NEW_WINE,
          };

          const updateRes: DbResponse = await db.wine.update(uid, id, newData);

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error updating wine`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.wine.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating wine`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e
        );

        enqueueSnackbar(`Error creating wine`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType]
  );

  const onSubmit = async (data: Wine) => {
    setIsSubmitting(true);

    try {
      await handleCreateWine(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selected.length > 0 && wines.length > 0) {
      const existingWine = wines.find(({ id }) => id === selected[0]?.id);

      if (!existingWine) return;

      setWorkingWine(existingWine);
    } else {
      setWorkingWine(undefined);
    }
  }, [wines, selected]);

  useEffect(() => {
    const formatted = {
      ...workingWine,
      ...(!workingWine && {
        id: Date.now().toString(),
      }),
      status: workingWine?.status || WineStatus.NEW_WINE,
    } as Wine;

    reset(formatted);
    setFormData(formatted);
  }, [reset, workingWine]);

  useEffect(() => {
    if (errors) {
      console.log("[WINE FORM ERRORS]", errors);
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
                <div className="flex flex-col gap-4">
                  <div className="hidden">
                    <FormControl>
                      <Input
                        id={formData?.id as Wine["id"]}
                        value={formData?.id}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-2">
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
                            : undefined
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
                      Enter wine name:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="name"
                        label="Wine name"
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter grape variety:
                    </InputLabel>

                    <Autocomplete<GrapeVariety, true, true, true>
                      freeSolo
                      multiple
                      options={[]}
                      value={[]}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        const added = newValue ? newValue.at(-1) : undefined;
                        if (!added) return;
                        const updated = [
                          ...(formData?.grapeVarieties ?? []),
                          {
                            id: Date.now().toString(),
                            name: added,
                            percentage: 0,
                          } as GrapeVariety,
                        ];
                        handleSelectChange("grapeVarieties", updated);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Add grape variety"
                        />
                      )}
                    />
                    {(formData?.grapeVarieties || []).length > 0 && (
                      <Stack
                        p={2}
                        pb={1}
                        gap={1}
                        sx={{
                          border: "1px solid var(--mui-palette-divider)",
                        }}
                      >
                        {formData?.grapeVarieties?.map(
                          ({ id, name, percentage = "" }, index) => (
                            <Fragment key={`${id || index}`}>
                              <Stack
                                gap={1}
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
                                    id="percentage"
                                    size="small"
                                    label="%"
                                    type="number"
                                    variant="outlined"
                                    value={percentage}
                                    slotProps={{
                                      htmlInput: { min: 1, step: "any" },
                                    }}
                                    sx={{ width: "80px" }}
                                    onChange={(e) => {
                                      const updated = [
                                        ...(formData?.grapeVarieties || []),
                                      ];
                                      updated[index].percentage = Number(
                                        e.target.value
                                      );
                                      handleSelectChange(
                                        "grapeVarieties",
                                        updated
                                      );
                                    }}
                                  />
                                </FormControl>

                                <IconButton
                                  size="small"
                                  disabled={false}
                                  onClick={() => {
                                    const updated =
                                      formData?.grapeVarieties?.filter(
                                        (variety) => variety.id !== id
                                      );
                                    handleSelectChange(
                                      "grapeVarieties",
                                      updated
                                    );
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
                                {errors?.grapeVarieties &&
                                  Array.isArray(errors?.grapeVarieties) &&
                                  (errors?.grapeVarieties[index]?.qty
                                    ?.message as string)}
                              </Typography>
                            </Fragment>
                          )
                        )}
                      </Stack>
                    )}

                    {errors?.grapeVarieties && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.grapeVarieties?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select vessels used:
                    </InputLabel>

                    <Autocomplete
                      multiple
                      noOptionsText="No vessels available"
                      options={vessels.filter(
                        (vessel) =>
                          vessel.rowType !== "group" &&
                          !formData?.vessels?.some(({ id }) => id === vessel.id)
                      )}
                      value={[]}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        const added = newValue.at(-1);
                        if (!added) return;
                        const updated = [
                          ...(formData?.vessels ?? []),
                          { ...added, qty: 1 } as MustWineVessel,
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
                                        ...(formData?.vessels || []),
                                      ];
                                      updated[index].qty = Number(
                                        e.target.value
                                      );
                                      handleSelectChange("vessels", updated);
                                    }}
                                  />
                                </FormControl>

                                <IconButton
                                  size="small"
                                  disabled={false}
                                  onClick={() => {
                                    const updated = formData?.vessels?.filter(
                                      (vessel) => vessel.id !== id
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
                          )
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
                  </div>

                  <div className="flex flex-col gap-2">
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
                  </div>

                  <div className="flex flex-col gap-2">
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
                  </div>
                </div>
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
                <div className="p-4 flex flex-col gap-4 border-l">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter date:
                    </InputLabel>

                    <Controller
                      name="labData.date"
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
                            onChange={(newValue) =>
                              field.onChange(
                                newValue
                                  ? Timestamp.fromDate(newValue.toDate())
                                  : null
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

                    {errors?.labData?.date && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.date?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter temperature:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.temperature.value"
                          label="Temperature"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: "any", max: 100 },
                          }}
                          {...register("labData.temperature.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.temperature.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={formData?.labData?.temperature?.unit || "°C"}
                          {...register("labData.temperature.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.temperature?.unit || "°C"}
                      </Box>
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

                    {errors?.labData?.temperature?.unit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.temperature?.unit?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter alcohol:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.alcohol"
                          label="Alcohol"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.alcohol.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.alcohol.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={formData?.labData?.alcohol?.unit || "%"}
                          {...register("labData.alcohol.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.alcohol?.unit || "%"}
                      </Box>
                    </Stack>

                    {errors?.labData?.alcohol && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.alcohol?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter sugar:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.sugar.value"
                          label="Sugar"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.sugar.value")}
                        />
                      </FormControl>

                      {CONCENTRATION_UNITS.length === 1 ? (
                        <>
                          <FormControl sx={{ display: "none" }}>
                            <Input
                              id="labData.sugar.unit"
                              label="Unit"
                              type="hidden"
                              variant="outlined"
                              value={
                                formData?.labData?.sugar?.unit ||
                                CONCENTRATION_UNITS[0] ||
                                "g/dm?"
                              }
                              {...register("labData.sugar.unit")}
                            />
                          </FormControl>

                          <Box sx={{ width: "60px" }}>
                            {formData?.labData?.sugar?.unit ||
                              CONCENTRATION_UNITS[0] ||
                              "g/dm?"}
                          </Box>
                        </>
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
                          {...register("labData.acidity.value")}
                        />
                      </FormControl>

                      {CONCENTRATION_UNITS.length === 1 ? (
                        <>
                          <FormControl sx={{ display: "none" }}>
                            <Input
                              id="labData.acidity.unit"
                              label="Unit"
                              type="hidden"
                              variant="outlined"
                              value={
                                formData?.labData?.acidity?.unit ||
                                CONCENTRATION_UNITS[0] ||
                                "g/dm?"
                              }
                              {...register("labData.acidity.unit")}
                            />
                          </FormControl>

                          <Box sx={{ width: "60px" }}>
                            {formData?.labData?.acidity?.unit ||
                              CONCENTRATION_UNITS[0] ||
                              "g/dm?"}
                          </Box>
                        </>
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
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter volatile acidity:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.volatileAcidity"
                          label="Volatile acidity"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.volatileAcidity.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.volatileAcidity.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={
                            formData?.labData?.volatileAcidity?.unit || "g/L"
                          }
                          {...register("labData.volatileAcidity.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.volatileAcidity?.unit || "g/L"}
                      </Box>
                    </Stack>

                    {errors?.labData?.volatileAcidity && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labData?.volatileAcidity?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter total SO₂:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.totalSO2"
                          label="Total SO₂"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.totalSO2.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.yeastActivityPopulation.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={formData?.labData?.totalSO2?.unit || "ppm"}
                          {...register("labData.totalSO2.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.totalSO2?.unit || "ppm"}
                      </Box>
                    </Stack>

                    {errors?.labData?.totalSO2 && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labData.totalSO2?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter free SO₂:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.freeSO2"
                          label="Free SO₂"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.freeSO2.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.freeSO2.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={formData?.labData?.freeSO2?.unit || "ppm"}
                          {...register("labData.freeSO2.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.freeSO2?.unit || "ppm"}
                      </Box>
                    </Stack>

                    {errors?.labData?.freeSO2 && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labData.freeSO2?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter lab technician name:
                    </InputLabel>

                    <FormControl>
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
                        {errors.labData.labTechnicianName?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter lab certificate ID:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="labData.labCertificateID"
                        label="Lab certificate ID"
                        type="text"
                        variant="outlined"
                        {...register("labData.labCertificateID")}
                      />
                    </FormControl>

                    {errors?.labData?.labCertificateID && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors.labData.labCertificateID?.message as string}
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
