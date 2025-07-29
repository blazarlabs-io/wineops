
"use client";

import { useMust } from "@/context/must";
import { useVessel } from "@/context/vessel";
import { CONCENTRATION_UNITS } from "@/data/constants";
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
  });

  const [formData, setFormData] = useState<Must | undefined>();

  const handleSelectChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Must, value);
      setFormData((prev) => ({ ...(prev as Must), [name]: value }));
    },
    [setValue]
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
        console.error("Error creating document or subcollection with data: ", e);

        enqueueSnackbar(`Error creating must`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType]
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
        id: Date.now().toString(),
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
                <div className="flex flex-col gap-4">
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
                                    const updated = formData.vessels?.filter(
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
                                "g/dm³"
                              }
                              {...register("labData.sugar.unit")}
                            />
                          </FormControl>

                          <Box sx={{ width: "60px" }}>
                            {formData?.labData?.sugar?.unit ||
                              CONCENTRATION_UNITS[0] ||
                              "g/dm³"}
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
                                "g/dm³"
                              }
                              {...register("labData.acidity.unit")}
                            />
                          </FormControl>

                          <Box sx={{ width: "60px" }}>
                            {formData?.labData?.acidity?.unit ||
                              CONCENTRATION_UNITS[0] ||
                              "g/dm³"}
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
                      Enter yeast activity / population:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.yeastActivityPopulation"
                          label="Yeast activity / population"
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register("labData.yeastActivityPopulation.value")}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.yeastActivityPopulation.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={
                            formData?.labData?.yeastActivityPopulation?.unit ||
                            "million cells/mL"
                          }
                          {...register("labData.yeastActivityPopulation.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.yeastActivityPopulation?.unit ||
                          "million cells/mL"}
                      </Box>
                    </Stack>

                    {errors?.labData?.yeastActivityPopulation && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors.labData.yeastActivityPopulation
                            ?.message as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter yeast assimilable nitrogen:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="labData.yeastAssimilableNitrogen"
                          label="Yeast assimilable nitrogen  "
                          variant="outlined"
                          type="number"
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          {...register(
                            "labData.yeastAssimilableNitrogen.value"
                          )}
                        />
                      </FormControl>

                      <FormControl sx={{ display: "none" }}>
                        <Input
                          id="labData.yeastAssimilableNitrogen.unit"
                          label="Unit"
                          type="hidden"
                          variant="outlined"
                          value={
                            formData?.labData?.yeastAssimilableNitrogen?.unit ||
                            "mg N/L"
                          }
                          {...register("labData.yeastAssimilableNitrogen.unit")}
                        />
                      </FormControl>

                      <Box sx={{ width: "60px" }}>
                        {formData?.labData?.yeastAssimilableNitrogen?.unit ||
                          "mg N/L"}
                      </Box>
                    </Stack>

                    {errors?.labData?.yeastAssimilableNitrogen && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors.labData.yeastAssimilableNitrogen
                            ?.message as string
                        }
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
