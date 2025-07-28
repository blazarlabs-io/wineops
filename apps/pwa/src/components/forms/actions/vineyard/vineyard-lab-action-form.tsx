/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardGlobalActionSample } from "@/data/actions-samples";
import { ActionFormProps, VineyardGlobalAction } from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { vineyardGlobalActionSchema } from "@/models/schemas/actions/vineyard-global-action-schema";
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
  TextareaAutosize,
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
import { Vineyard } from "@/models/types/db";
import { NumberSchema } from "joi";

export default function VineyardLabActionForm({
  onBackClick,
}: ActionFormProps) {
  const { dialogs, vineyard } = useDialogDrawerStore((state) => state);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { vineyards = [], actions, labReports } = useVineyard();

  const selected = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Vineyard[];

  const selectedVineyards = useMemo(
    () =>
      `${dialogs["action-drawer"]}` === "lab-report" && vineyard
        ? [vineyard]
        : (selected.length > 0
            ? selected.map(
                (selected) =>
                  vineyards.find(({ id }) => id === selected.id) ?? selected
              )
            : vineyards
          ).filter(({ rowType }) => rowType === "item"),
    [dialogs, selected, vineyard, vineyards]
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();

  const userId =
    teamMembers?.find(
      ({ id, email }) => email === user?.email || id === user?.uid
    )?.id ||
    user?.email ||
    user?.uid ||
    "";

  const labActionSchema = vineyardGlobalActionSchema.fork(
    ["inputData.sugar"],
    (schema) =>
      (schema as NumberSchema)
        .precision(2)
        .min(0.01)
        .max(10_000)
        .required()
        .messages({
          "any.required": "Please enter a valid number for the sugar",
          "number.empty": "Please enter a valid number for the sugar",
          "number.base": "Please enter a valid number for the sugar",
          "number.precision": "Sugar must have at most 2 decimal places",
          "number.min": "Sugar must be greater than 0 g/dm³",
          "number.max": "Sugar cannot exceed 10,000 g/dm³",
        })
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: joiResolver(labActionSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [formData, setFormData] = useState<VineyardGlobalAction>(
    vineyardGlobalActionSample
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name, value, { shouldTouch: true, shouldValidate: true });

      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        [name]: value,
      }));
    },
    [setValue]
  );

  const handleNewUpload = useCallback(
    (name: string, url: string, file: File) => {
      const filesUrls = formData.supportingDocuments || [];

      filesUrls.push({
        name: file.name,
        url,
      });
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
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

      // TODO: upload file and show upload progress...
      db.storage.uploadFile(
        file,
        user?.uid,
        "labReport",
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
        ...(prev as VineyardGlobalAction),
        supportingDocuments: filesUrls,
      }));
      setValue("supportingDocuments", filesUrls);
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "labReport",
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
    console.log("SUBMIT:", data);
    console.log("ERRORS:", errors);

    const subjectVineyard = selectedVineyards.filter(
      (v) => v.id === data.inUseVineyard.id
    )[0];

    setIsSubmitting(true);

    const labDataToDelete = (
      subjectVineyard || { labData: [] }
    ).labData?.filter((lab) => {
      const rawLabDate =
        lab.date || labReports.find(({ id }) => id === lab.id)?.date;
      const labDate = rawLabDate ? toDateSafe(rawLabDate) : "";
      const execDate = formData.executionDate
        ? toDateSafe(formData.executionDate)
        : "";

      return labDate && execDate && isSameDay(labDate, execDate);
    });

    const labDataToDeleteIds = labDataToDelete?.map(({ id }) => id);

    try {
      await actions?.["lab-report"].exec(
        user?.uid as string,
        { ...data, labDataToDeleteIds },
        subjectVineyard
      );
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    vineyardGlobalActionSample.id = crypto.randomUUID();
    vineyardGlobalActionSample.type = "lab-report";
    vineyardGlobalActionSample.executionDate = Timestamp.fromDate(new Date());
    vineyardGlobalActionSample.createdAt = Timestamp.fromDate(new Date());
    vineyardGlobalActionSample.createdBy = userId;

    if (selectedVineyards && selectedVineyards.length === 1) {
      vineyardGlobalActionSample.inUseVineyard = {
        id: selectedVineyards[0]?.id,
        name: selectedVineyards[0]?.name,
      };
    } else {
      vineyardGlobalActionSample.inUseVineyard = {
        id: "",
        name: "",
      };
    }

    vineyardGlobalActionSample.supportingDocuments = [];

    reset(vineyardGlobalActionSample);
    setFormData(vineyardGlobalActionSample);
  }, [reset, selectedVineyards, userId]);

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
                  id={formData.id as VineyardGlobalAction["id"]}
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
                    Selected vineyard
                  </InputLabel>

                  <Autocomplete<Vineyard, false, false, false>
                    noOptionsText="No vineyards available"
                    options={selectedVineyards}
                    value={(formData?.inUseVineyard as Vineyard) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(_event, newValue) => {
                      if (!newValue) return;

                      handleChange("inUseVineyard", {
                        id: newValue.id,
                        name: newValue.name,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Vineyard name"
                      />
                    )}
                  />
                  {((errors?.inUseVineyard as any)?.id ||
                    (errors?.inUseVineyard as any)?.name) && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {
                        ((errors?.inUseVineyard as any)?.id?.message ||
                          (errors?.inUseVineyard as any)?.name
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
                    label="Execution Date"
                    disableFuture
                    views={["year", "month", "day"]}
                    className="w-full"
                    onChange={(date) => {
                      if (!date) return;

                      handleChange(
                        "executionDate",
                        Timestamp.fromDate(date.toDate())
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
                          value.startsWith(name)
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
                  <InputLabel className="text-sm text-muted-foreground">
                    Enter the mass concentration of sugars (g/dm³)
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="outlined-basic"
                      label="Sugar (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 10_000,
                        },
                      }}
                      {...register("inputData.sugar")}
                    />
                  </FormControl>

                  {(errors.inputData as any)?.sugar?.message && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {(errors.inputData as any)?.sugar.message}
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
                      id="outlined-basic"
                      label="Acidity (g/dm³)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                          max: 10_000,
                        },
                      }}
                      {...register("inputData.acidity")}
                    />
                  </FormControl>
                </Stack>

                <Stack gap={1}>
                  <InputLabel className="text-sm text-muted-foreground">
                    Description
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextareaAutosize
                      id="additionalInformation"
                      minRows={8}
                      placeholder="Provide additional information"
                      style={{
                        width: "100%",
                        border: "1px solid",
                        borderColor: "var(--mui-palette-divider)",
                        borderRadius: "4px",
                        padding: "16px 8px",
                      }}
                      {...register("additionalInformation")}
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
