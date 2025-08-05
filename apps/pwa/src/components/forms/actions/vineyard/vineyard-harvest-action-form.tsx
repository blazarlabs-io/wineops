/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardHarvestActionSample } from "@/data/actions-samples";
import { useAuth } from "@/lib/firebase/auth";
import { vineyardHarvestActionSchema } from "@/models/schemas/actions/vineyard-harvest-action-schema";
import { ActionFormProps, VineyardHarvestAction } from "@/models/types/actions";
import { Vineyard, VineyardStatus } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useConsumable } from "@/context/consumable";
import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Attachment, DeleteOutline, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import { useColorScheme } from "@mui/material/styles";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { parseToDate } from "@/utils/date-format";
import { File } from "lucide-react";
import { db } from "@/lib/firebase/services";
import { cleanObject } from "@/utils/clean-object";
import { hasKeyFromArray } from "../../utils";

const defaultValues = {
  id: crypto.randomUUID(),
  type: "harvest",
  weight: "",
  executionDate: Timestamp.now(),
  equipment: [],
  consumables: [],
  supportingDocuments: [],
  sugar: {},
  acidity: {},
  subject: {
    id: "",
    name: "",
  },
} as unknown as VineyardHarvestAction;

export default function VineyardHarvestActionForm({
  onBackClick,
}: ActionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [transportInfoExpanded, setTransportInfoExpanded] = useState(false);
  const [qualityParamsExpanded, setQualityParamsExpanded] = useState(false);

  const handleGeneralExpansion = () => {
    setGeneralExpanded((prevExpanded) => !prevExpanded);
  };

  const handleTransportInfoExpansion = () => {
    setTransportInfoExpanded((prevExpanded) => !prevExpanded);
  };

  const handleQualityParamsExpansion = () => {
    setQualityParamsExpanded((prevExpanded) => !prevExpanded);
  };

  const { vineyards = [], actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected,
  ) as Vineyard[];

  const filteredVineyards = useMemo(
    () =>
      (selectedVineyards.length > 0
        ? selectedVineyards.map(
            (selected) =>
              vineyards.find(({ id }) => id === selected.id) ?? selected,
          )
        : vineyards
      ).filter(({ rowType }) => rowType === "item"),
    [selectedVineyards, vineyards],
  );

  const { user } = useAuth();
  const { grapes } = useGrape();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    control,
  } = useForm<VineyardHarvestAction>({
    resolver: joiResolver(vineyardHarvestActionSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues,
  });
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { teamMembers } = useWinery();
  const [formData, setFormData] = useState<VineyardHarvestAction>(
    vineyardHarvestActionSample,
  );
  const { labReports: labData } = useVineyard();
  const { consumables } = useConsumable();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name === "responsible") {
        const selectedMember = teamMembers.filter((m) => m.name === value)[0];
        setValue("responsible", selectedMember);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            responsible: selectedMember,
          };
        });
        return;
      } else if (name === "sugar.value") {
        setValue("sugar.value", value as number);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            sugar: {
              ...prevData.sugar,
              value: value,
            },
          };
        });
        return;
      } else if (name === "acidity.value") {
        setValue("acidity.value", value as number);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            acidity: {
              ...prevData.acidity,
              value: value,
            },
          };
        });
      } else {
        setValue(name as keyof VineyardHarvestAction, value);
        setFormData((prev) => ({
          ...(prev as VineyardHarvestAction),
          [name]: value,
        }));
      }
    },
    [setValue, teamMembers],
  );

  const handleNewUpload = useCallback(
    (name: string, url: string, file: File) => {
      const filesUrls = formData.supportingDocuments || [];

      filesUrls.push({
        name: file.name,
        url,
      });

      setFormData((prev) => ({
        ...(prev as VineyardHarvestAction),
        supportingDocuments: filesUrls,
      }));

      setValue(name as keyof VineyardHarvestAction, filesUrls);
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
        "harvest",
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
        (_error: Error) => {
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
        ...(prev as VineyardHarvestAction),
        supportingDocuments: filesUrls,
      }));

      setValue("supportingDocuments", filesUrls);
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "harvest",
        name,
      );

      if (deleteFileRes.status == 200) {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [clearErrors, formData.supportingDocuments, setValue, user?.uid],
  );

  const onSubmit = useCallback(
    async (data: any) => {
      const selected = filteredVineyards.find(
        ({ id }) => id === data.subject?.id,
      );

      if (!selected) {
        setError("subject.name", {
          type: "manual",
          message: "Please select a vineyard",
        });
        return;
      }

      if (!data.batchId) {
        setError("batchId", {
          type: "manual",
          message: "Please enter a Batch ID",
        });

        return;
      }

      const existingBatchId = grapes?.some(
        ({ name, group, rowType }) =>
          (rowType === "item" &&
            name.trim().toLowerCase() === data.batchId.trim().toLowerCase()) ||
          (rowType !== "item" &&
            group?.[0]?.trim().toLowerCase() ===
              data.batchId.trim().toLowerCase()),
      );

      if (existingBatchId) {
        setError("batchId", {
          type: "manual",
          message:
            "This Batch ID is already taken. Please enter a different one",
        });

        return;
      }

      const cleanData = cleanObject(data);

      for (let index = 0; index < (data?.consumables?.length || 0); index++) {
        const consumable = data.consumables?.[index];

        if ((consumable?.qty || 0) <= 0) {
          setError(`consumables.${index}.qty`, {
            type: "manual",
            message: `Please enter a valid number for the quantity`,
          });

          return;
        }

        if ((consumable?.qty || 0) > (consumable?.stockConsumableQty || 0)) {
          setError(`consumables.${index}.qty`, {
            type: "manual",
            message: `Quantity (${consumable?.qty}) must be less or equal with the total consumable quantity (${consumable?.stockConsumableQty || 0})`,
          });

          return;
        }
      }

      setIsSubmitting(true);

      try {
        await actions?.harvest.exec(user?.uid as string, cleanData, selected);
      } finally {
        setIsSubmitting(false);
      }

      setFormData(data);

      onBackClick?.();
    },
    [
      actions?.harvest,
      filteredVineyards,
      grapes,
      onBackClick,
      setError,
      user?.uid,
    ],
  );

  useEffect(() => {
    const selected =
      filteredVineyards.length === 1
        ? filteredVineyards[0]
        : filteredVineyards.find(({ id }) => id === formData.subject?.id);

    let subjectUpdates;

    if (!selected) {
      subjectUpdates = {
        subject: { id: "", name: "" },
        sugar: {},
        acidity: {},
        harvestEnded: false,
      };
    } else {
      const latestLabData =
        labData
          ?.filter((l) => selected?.labData?.some((ld) => ld.id === l.id))
          ?.sort(
            (a, b) =>
              (b.date as Timestamp).toDate().getTime() -
              (a.date as Timestamp).toDate().getTime(),
          )?.[0] || {};

      const { id = "", date = "", results = {}, units = [] } = latestLabData;
      const unit = (units?.[0] as string) || "";

      subjectUpdates = {
        subject: {
          id: selected.id,
          name: selected.name,
        },
        sugar: {
          id,
          name: "",
          value: results?.sugar?.value || undefined,
          variation: results?.sugar?.variation,
          date,
          unit,
        },
        acidity: {
          id,
          name: "",
          value: results?.acidity?.value || undefined,
          variation: results?.acidity?.variation,
          date,
          unit,
        },
        harvestEnded: selected.status === VineyardStatus.HARVEST_ENDED,
      };
    }

    Object.entries(subjectUpdates).forEach(([key, value]) => {
      setValue(key as keyof VineyardHarvestAction, value);

      if (key === "sugar" || key === "acidity") {
        setValue(`${key}.value` as keyof VineyardHarvestAction, value.value);
      }
    });

    setFormData((prev) => ({ ...prev, ...subjectUpdates }));
  }, [filteredVineyards, formData.subject?.id, labData, setValue]);

  useEffect(() => {
    const hasGeneralErrors = hasKeyFromArray(
      [
        "subject",
        "executionDate",
        "batchId",
        "weight",
        "responsible",
        "consumables",
        "equipment",
      ],
      errors,
    );
    if (hasGeneralErrors) setGeneralExpanded(true);

    const hasTransportInfoError = hasKeyFromArray(
      [
        "location",
        "invoiceNumber",
        "transportCompanyName",
        "transportVehicleId",
        "transportDriverName",
      ],
      errors,
    );
    if (hasTransportInfoError) setTransportInfoExpanded(true);

    const hasQualityParamsErrors = hasKeyFromArray(
      ["sugar", "acidity", "certificateOfInofensivitate"],
      errors,
    );
    if (hasQualityParamsErrors) setQualityParamsExpanded(true);
  }, [errors]);

  const filteredConsumables = useMemo(
    () =>
      consumables.filter(
        ({ id, rowType, qty = 0 }) =>
          rowType === "item" &&
          qty > 0 &&
          !formData.consumables?.some((consumable) => consumable.id === id),
      ),
    [consumables, formData.consumables],
  );

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
                  id={formData.id as VineyardHarvestAction["id"]}
                  value={formData.id}
                  type="hidden"
                  {...register("id")}
                />
              </FormControl>
            </div>

            <Accordion
              defaultExpanded
              sx={{
                background: isDarkMode
                  ? "#121212 !important"
                  : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters
              expanded={generalExpanded}
              onChange={handleGeneralExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span">General Info</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Selected vineyard
                  </InputLabel>

                  <FormControl fullWidth>
                    <Autocomplete
                      id="subject.name"
                      options={filteredVineyards}
                      value={formData.subject || null}
                      getOptionLabel={({ name }) => name}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} label="Vineyard" />
                      )}
                      onChange={(_event, newValue) => {
                        handleChange(
                          "subject",
                          newValue
                            ? {
                                id: newValue.id,
                                name: newValue.name,
                              }
                            : { id: "", name: "" },
                        );
                      }}
                    />
                  </FormControl>

                  {((errors?.subject as any)?.id ||
                    (errors?.subject as any)?.name) && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {
                        ((errors?.subject as any)?.id?.message ||
                          (errors?.subject as any)?.name?.message) as string
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
                    label="Execution Date"
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

                  {errors?.executionDate?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.executionDate.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the Batch ID
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      label="Batch ID"
                      variant="outlined"
                      {...register("batchId")}
                    />
                  </FormControl>

                  {errors?.batchId?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.batchId.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the weight (kg)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="outlined-basic"
                      label="Weight (kg)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 1_000_000,
                        },
                        inputLabel: {
                          ...((+formData?.weight || 0) > 0 && { shrink: true }),
                        },
                      }}
                      {...register("weight")}
                    />
                  </FormControl>

                  {errors?.weight?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.weight.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the responsible person
                  </InputLabel>

                  <FormControl fullWidth>
                    <ResponsibleTeamMemberField
                      label="Responsible person"
                      teamMembers={teamMembers}
                      onChange={(value) => {
                        if (!value) return;

                        handleChange("responsible.name", value);
                      }}
                    />
                  </FormControl>
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the consumables used
                  </InputLabel>

                  <Autocomplete
                    multiple
                    noOptionsText="No consumables available"
                    options={filteredConsumables}
                    value={[]}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(_event, newValue) => {
                      const added = newValue.at(-1);
                      if (!added) return;

                      const { id, name, qty = 0 } = added;

                      const updated = [
                        ...(formData.consumables ?? []),
                        { id, name, qty: 1, stockConsumableQty: qty },
                      ];

                      handleChange("consumables", updated);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Consumables used"
                      />
                    )}
                  />

                  {(formData?.consumables || []).length > 0 && (
                    <Stack
                      p={2}
                      pb={1}
                      gap={1}
                      sx={{
                        border: "1px solid var(--mui-palette-divider)",
                      }}
                    >
                      {formData?.consumables?.map(
                        (
                          { id, name, qty = "", stockConsumableQty = 0 },
                          index,
                        ) => (
                          <Fragment key={id}>
                            <Stack
                              key={id}
                              gap={0.5}
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
                                    htmlInput: {
                                      min: 1,
                                      step: 1,
                                    },
                                  }}
                                  sx={{ width: "80px" }}
                                  onChange={(e) => {
                                    const updated = [
                                      ...(formData.consumables || []),
                                    ];
                                    updated[index].qty = Number(e.target.value);
                                    handleChange("consumables", updated);
                                  }}
                                />
                              </FormControl>

                              <Typography
                                variant="body2"
                                component="div"
                                sx={{ width: "40px" }}
                              >
                                /&nbsp;{stockConsumableQty}
                              </Typography>

                              <IconButton
                                size="small"
                                disabled={false}
                                onClick={() => {
                                  const updated = formData.consumables?.filter(
                                    (item) => item.id !== id,
                                  );
                                  handleChange("consumables", updated);
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
                              {errors?.consumables &&
                                Array.isArray(errors?.consumables) &&
                                (errors?.consumables[index]?.qty
                                  ?.message as string)}
                            </Typography>
                          </Fragment>
                        ),
                      )}
                    </Stack>
                  )}

                  {errors?.consumables?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.consumables.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Select the tools & equipment used
                  </InputLabel>

                  <Autocomplete
                    id="equipment"
                    noOptionsText="No tools & equipment available"
                    multiple
                    options={[]}
                    value={formData?.equipment}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(_event, newValue) => {
                      if (!newValue) return;

                      handleChange(
                        "equipment",
                        newValue.map(({ id, name }) => ({ id, name })),
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tools & equipment used"
                      />
                    )}
                  />

                  {errors?.equipment?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.equipment.message as string}
                    </Typography>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background: isDarkMode
                  ? "#121212 !important"
                  : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters
              defaultExpanded={false}
              expanded={transportInfoExpanded}
              onChange={handleTransportInfoExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span">Transporation Info</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Select the processing location
                  </InputLabel>

                  <Autocomplete
                    id="location"
                    freeSolo
                    options={[]}
                    value={formData?.location}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="Processing location" />
                    )}
                    onChange={(_e, value) => {
                      handleChange("location", value);
                    }}
                    onInputChange={(_e, newInputValue) => {
                      handleChange("location", newInputValue);
                    }}
                  />

                  {errors?.location?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.location.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the dispatch invoice
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      label="Dispatch Invoice"
                      variant="outlined"
                      {...register("invoiceNumber")}
                    />
                  </FormControl>

                  {errors?.invoiceNumber?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.invoiceNumber.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the transportation company name
                  </InputLabel>

                  <Autocomplete
                    id="transportCompanyName"
                    freeSolo
                    options={[]}
                    value={formData?.transportCompanyName}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="Company name" />
                    )}
                    onChange={(_e, value) => {
                      handleChange("transportCompanyName", value);
                    }}
                    onInputChange={(_e, newInputValue) => {
                      handleChange("transportCompanyName", newInputValue);
                    }}
                  />

                  {errors?.transportCompanyName?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.transportCompanyName.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the vehicle registration number
                  </InputLabel>

                  <Autocomplete
                    id="transportVehicleId"
                    freeSolo
                    options={[]}
                    value={formData?.transportVehicleId}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="Vehicle number" />
                    )}
                    onChange={(_e, value) => {
                      handleChange("transportVehicleId", value);
                    }}
                    onInputChange={(_e, newInputValue) => {
                      handleChange("transportVehicleId", newInputValue);
                    }}
                  />

                  {errors?.transportVehicleId?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.transportVehicleId.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the driver name
                  </InputLabel>

                  <Autocomplete
                    id="transportDriverName"
                    freeSolo
                    options={[]}
                    value={formData?.transportDriverName}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="Driver name" />
                    )}
                    onChange={(_e, value) => {
                      handleChange("transportDriverName", value);
                    }}
                    onInputChange={(_e, newInputValue) => {
                      handleChange("transportDriverName", newInputValue);
                    }}
                  />

                  {errors?.transportDriverName?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.transportDriverName.message as string}
                    </Typography>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background: isDarkMode
                  ? "#121212 !important"
                  : "#ffffff !important",
                borderBottom: "1px solid var(--mui-palette-divider) !important",
              }}
              disableGutters
              defaultExpanded={false}
              expanded={qualityParamsExpanded}
              onChange={handleQualityParamsExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span">Quality Parameters</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
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
                      id="sugar"
                      label="Sugar (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                        inputLabel: {
                          ...((formData?.sugar?.value || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("sugar.value")}
                    />
                  </FormControl>

                  {(errors?.sugar as any)?.value && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {(errors?.sugar as any)?.value?.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the acidity (g/dm³)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      id="acidity"
                      type="number"
                      label="Acidity (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: { min: 0, step: 0.01, max: 10_000_000 },
                        inputLabel: {
                          ...((formData?.acidity?.value || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("acidity.value")}
                    />
                  </FormControl>

                  {(errors?.acidity as any)?.value && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {(errors?.acidity as any)?.value?.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the certificat de inofensivitate ID
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      label="Certificat de inofensivitate ID"
                      variant="outlined"
                      {...register("certificateOfInofensivitate")}
                    />
                  </FormControl>

                  {errors?.certificateOfInofensivitate?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.certificateOfInofensivitate.message as string}
                    </Typography>
                  )}
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
                    id="description"
                    minRows={8}
                    placeholder="Provide additional information"
                    style={{
                      width: "100%",
                      border: "1px solid",
                      borderColor: "var(--mui-palette-divider)",
                      borderRadius: "4px",
                      padding: "16px 8px",
                    }}
                    {...register("description")}
                  />
                </FormControl>

                {errors?.description?.message && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors.description.message as string}
                  </Typography>
                )}
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
                    {errors?.supportingDocuments?.message as string}
                  </Typography>
                )}
                <div ref={supportingDocumentsRef}></div>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box p={2} gap={2} display="flex" justifyContent="space-between">
          <Stack direction="row" spacing={0} alignItems="center">
            <Controller
              name="harvestEnded"
              control={control}
              render={({ field }) => (
                <Checkbox
                  color="error"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Typography variant="body1" color="textSecondary">
              Harvest ended
            </Typography>
          </Stack>

          <Stack
            gap={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              disabled={isSubmitting}
              variant="outlined"
              component="label"
              className="w-auto flex items-center gap-2"
              sx={{ pb: 0.75 }}
            >
              <Attachment className="w-4 h-4 rotate-90" />
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
          </Stack>
        </Box>
      </form>
    </div>
  );
}
