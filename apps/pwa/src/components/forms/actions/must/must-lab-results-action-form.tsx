/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ActionFormProps, MustLabResultsAction } from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Attachment, DeleteOutline } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  TextField as Input,
  InputLabel,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { File } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { useDialogDrawerStore } from "@/store/dialogs";
import { parseToDate } from "@/utils/date-format";
import { MustWithVessel } from "@/models/types/db";
import { useMust } from "@/context/must";
import { mustLabResultsActionSchema } from "@/models/schemas/actions/must-lab-results-action-schema";

const initialFormData: MustLabResultsAction = {
  id: "",
  type: "lab-results",
  subjectMust: { id: "", name: "" },
  executionDate: "",
  sugar: null as unknown as number,
};

export default function MustLabResultsActionForm({
  onBackClick,
}: ActionFormProps) {
  const { dialogs, entity: must } = useDialogDrawerStore((state) => state);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { labReports } = useVineyard();

  const { musts: allMusts, actions } = useMust();

  const selected = useSelectedEntitiesStore(
    ({ selected }) => selected,
  ) as MustWithVessel[];

  const selectedMusts = useMemo(
    () =>
      `${dialogs["action-drawer"]}` === "lab-results" && must
        ? [must as MustWithVessel]
        : (selected.length > 0
            ? selected.map(
                (selected) =>
                  allMusts.find(({ id }) => id === selected.id) ?? selected,
              )
            : allMusts
          ).filter(({ rowType }) => rowType === "item"),
    [dialogs, must, selected, allMusts],
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();

  const userId =
    teamMembers?.find(
      ({ id, email }) =>
        email.toLowerCase() === user?.email?.toLowerCase() || id === user?.uid,
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
  } = useForm<MustLabResultsAction>({
    resolver: joiResolver(mustLabResultsActionSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [formData, setFormData] =
    useState<MustLabResultsAction>(initialFormData);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: keyof MustLabResultsAction, value: any) => {
      setValue(name, value, { shouldTouch: true, shouldValidate: true });

      setFormData((prev) => ({
        ...(prev as MustLabResultsAction),
        [name]: value,
      }));
    },
    [setValue],
  );

  const handleNewUpload = useCallback(
    (name: keyof MustLabResultsAction, url: string, file: File) => {
      const filesUrls = formData.supportingDocuments || [];

      filesUrls.push({
        name: file.name,
        url,
      });
      setFormData((prev) => ({
        ...(prev as MustLabResultsAction),
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
        "lab-results",
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
        ...(prev as MustLabResultsAction),
        supportingDocuments: filesUrls,
      }));
      setValue("supportingDocuments", filesUrls);
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "lab-results",
        name,
      );

      if (deleteFileRes.status == 200) {
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
      }
    },
    [clearErrors, formData.supportingDocuments, setValue, user?.uid],
  );

  const onSubmit = async (data: MustLabResultsAction) => {
    if (!user?.uid || !data?.subjectMust?.id) return;

    const subjectMust = selectedMusts.find(
      ({ id }) => id === data?.subjectMust?.id,
    );

    if (!subjectMust) return;

    setIsSubmitting(true);

    const labDataToDelete = (subjectMust || { labData: [] }).labData?.filter(
      (lab) => {
        const rawLabDate =
          lab.date || labReports.find(({ id }) => id === lab.id)?.date;
        const labDate = rawLabDate ? toDateSafe(rawLabDate) : "";
        const execDate = formData.executionDate
          ? toDateSafe(formData.executionDate)
          : "";

        return labDate && execDate && isSameDay(labDate, execDate);
      },
    );

    const labDataToDeleteIds = labDataToDelete?.map(({ id }) => id);

    try {
      await actions?.["lab-results"].exec(
        user.uid,
        { ...data, labDataToDeleteIds },
        subjectMust,
      );
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    const mustDecantActionSample: MustLabResultsAction = {
      ...initialFormData,
      id: crypto.randomUUID(),
      type: "lab-results",
      executionDate: Timestamp.fromDate(new Date()),
      supportingDocuments: [],
      subjectMust:
        selectedMusts.length === 1
          ? {
              id: selectedMusts[0]?.id,
              name: selectedMusts[0]?.name,
            }
          : { id: "", name: "" },
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: userId,
    };

    reset(mustDecantActionSample);
    setFormData(mustDecantActionSample);
  }, [reset, selectedMusts, userId]);

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
            p: 2,
            flex: 1,
            width: "100%",
            overflowY: "auto",
          }}
        >
          <Stack gap={2}>
            <div className="hidden">
              <FormControl>
                <Input
                  id={formData.id as MustLabResultsAction["id"]}
                  value={formData.id}
                  type="hidden"
                  {...register("id")}
                />
              </FormControl>
            </div>

            <Stack>
              <Stack gap={2}>
                <Typography>General Info</Typography>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Selected must
                  </InputLabel>

                  <Autocomplete<MustWithVessel, false, false, false>
                    noOptionsText="No musts available"
                    options={selectedMusts}
                    value={(formData?.subjectMust as MustWithVessel) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(_event, newValue) => {
                      if (!newValue) return;

                      handleChange("subjectMust", {
                        id: newValue.id,
                        name: newValue.name,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Must ID"
                      />
                    )}
                  />

                  {(errors?.subjectMust?.message ||
                    (errors?.subjectMust as any)?.id ||
                    (errors?.subjectMust as any)?.name) && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {
                        (errors?.subjectMust?.message ||
                          (errors?.subjectMust as any)?.id?.message ||
                          (errors?.subjectMust as any)?.name?.message) as string
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
                    disableFuture
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
                    Enter the responsible person
                  </InputLabel>

                  <FormControl fullWidth>
                    <ResponsibleTeamMemberField
                      label="Responsible person"
                      teamMembers={teamMembers}
                      onChange={(value: any) => {
                        if (!value) return;

                        const responsible = teamMembers.find(({ name }) =>
                          value.startsWith(name),
                        );

                        if (!responsible) {
                          setError("responsible", {
                            type: "manual",
                            message: "Responsible person not found",
                          });
                          return;
                        }

                        handleChange("responsible", responsible);
                      }}
                      currentValue={
                        formData?.responsible?.name !== undefined &&
                        formData?.responsible?.lastName !== undefined
                          ? `${formData?.responsible?.name} ${formData?.responsible?.lastName}`
                          : ""
                      }
                    />

                    {(errors?.responsible as any)?.name && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {(errors?.responsible as any)?.name?.message as string}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>

                <Typography>Lab Results</Typography>

                <Stack gap={1}>
                  <InputLabel
                    className="text-sm text-muted-foreground"
                    sx={{ whiteSpace: "normal" }}
                  >
                    Enter the temperature (°C)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="temperature"
                      label="Temperature (°C)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: -20,
                          step: 0.01,
                          max: 100,
                        },
                        inputLabel: {
                          ...((formData?.temperature || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("temperature")}
                    />
                  </FormControl>

                  {errors.temperature?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors.temperature.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel
                    className="text-sm text-muted-foreground"
                    sx={{ whiteSpace: "normal" }}
                  >
                    Enter the alcohol (%)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="alcohol"
                      label="Alcohol (%)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 100,
                        },
                        inputLabel: {
                          ...((formData?.alcohol || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("alcohol")}
                    />
                  </FormControl>

                  {errors?.alcohol?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.alcohol.message as string}
                    </Typography>
                  )}
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
                      id="sugar"
                      label="Sugar (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 10_000,
                        },
                        inputLabel: {
                          ...((formData?.sugar || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("sugar")}
                    />
                  </FormControl>

                  {errors?.sugar?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.sugar.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the acidity (g/dm³)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="acidity"
                      label="Acidity (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 10_000,
                        },
                        inputLabel: {
                          ...((formData?.acidity || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("acidity")}
                    />
                  </FormControl>

                  {errors?.acidity?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.acidity.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the pH
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
                          ...((formData?.pH || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("pH")}
                    />
                  </FormControl>

                  {errors?.pH?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.pH.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the density (g/cm³)
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
                          ...((formData?.density || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("density")}
                    />
                  </FormControl>

                  {errors?.density?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.density.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the volatile acidity (g/L)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="volatileAcidity"
                      label="Volatile acidity (g/L)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 10_000,
                        },
                        inputLabel: {
                          ...((formData?.volatileAcidity || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("volatileAcidity")}
                    />
                  </FormControl>

                  {errors?.volatileAcidity?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.volatileAcidity.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the malic acid (g/L)
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
                          ...((formData?.malicAcid || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("malicAcid")}
                    />
                  </FormControl>

                  {errors?.malicAcid?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.malicAcid.message as string}
                    </Typography>
                  )}
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the lactic acid (g/L)
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
                          ...((formData?.lacticAcid || 0) > 0 && {
                            shrink: true,
                          }),
                        },
                      }}
                      {...register("lacticAcid")}
                    />
                  </FormControl>

                  {errors?.lacticAcid?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.lacticAcid.message as string}
                    </Typography>
                  )}
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
                        disabled={isSubmitting}
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

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const toDateSafe = (input: string | Timestamp | undefined) => {
  if (!input) return undefined;
  if (typeof input === "string") return new Date(input);
  return input.toDate();
};
