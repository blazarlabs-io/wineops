/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardGlobalActionSample } from "@/data/actions-samples";
import {
  ActionFormProps,
  VineyardActionType,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useConsumable } from "@/context/consumable";
import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { vineyardGlobalActionSchema } from "@/models/schemas/actions/vineyard-global-action-schema";
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
import { useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { useAuth } from "@/lib/firebase/auth";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Vineyard } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { Attachment, DeleteOutline } from "@mui/icons-material";
import { db } from "@/lib/firebase/services";
import { File } from "lucide-react";
import { useChemistry } from "@/context/chemistry";

export default function VineyardGenericActionForm({
  onBackClick,
  actionKey,
}: ActionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { vineyards = [], actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Vineyard[];

  const filteredVineyards = useMemo(
    () =>
      (selectedVineyards.length > 0
        ? selectedVineyards.map(
            (selected) =>
              vineyards.find(({ id }) => id === selected.id) ?? selected
          )
        : vineyards
      ).filter(({ rowType }) => rowType === "item"),
    [selectedVineyards, vineyards]
  );

  const { user } = useAuth();
  const { consumables: allConsumables } = useConsumable();
  const { chemistry: allChemistry } = useChemistry();
  const { teamMembers } = useWinery();

  const userId =
    teamMembers?.find(
      ({ id, email }) => email === user?.email || id === user?.uid
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
    resolver: joiResolver(vineyardGlobalActionSchema),
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
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        [name]: value,
      }));

      setValue(name, value, { shouldTouch: true, shouldValidate: true });
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

      setValue(name, filesUrls, { shouldTouch: true, shouldValidate: true });
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
        actionKey,
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
          console.log(error);

          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      );
    },
    [
      actionKey,
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

      setValue("supportingDocuments", filesUrls, {
        shouldTouch: true,
        shouldValidate: true,
      });
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        actionKey,
        name
      );

      if (deleteFileRes.status == 200) {
        console.log("File deleted");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        console.log("Error deleting file");
      }
    },
    [actionKey, clearErrors, formData.supportingDocuments, setValue, user?.uid]
  );

  const onSubmit = async (data: any) => {
    if (!user?.uid || !actions[actionKey]) return;

    const subjectVineyard = filteredVineyards.find(
      ({ id }) => id === data.inUseVineyard.id
    );

    if (!subjectVineyard) return;

    console.log("SUBJECT VINEYARD:", subjectVineyard);

    for (let index = 0; index < (data?.chemistry?.length || 0); index++) {
      const chemistryItem = data.chemistry?.[index];

      if ((chemistryItem?.qty || 0) <= 0) {
        setError(`chemistry.${index}.qty`, {
          type: "manual",
          message: `Please enter a valid number for the quantity`,
        });

        return;
      }

      if (chemistryItem?.qty > (chemistryItem?.stockChemistryQty || 0)) {
        setError(`chemistry.${index}.qty`, {
          type: "manual",
          message: `Quantity (${chemistryItem?.qty}) must be less or equal with the total chemistry quantity (${chemistryItem?.stockChemistryQty || 0})`,
        });

        return;
      }
    }

    for (let index = 0; index < (data?.consumables?.length || 0); index++) {
      const consumable = data.consumables?.[index];

      if ((consumable?.qty || 0) <= 0) {
        setError(`consumables.${index}.qty`, {
          type: "manual",
          message: `Please enter a valid number for the quantity`,
        });

        return;
      }

      if (consumable?.qty > (consumable?.stockConsumableQty || 0)) {
        setError(`consumables.${index}.qty`, {
          type: "manual",
          message: `Quantity (${consumable?.qty}) must be less or equal with the total consumable quantity (${consumable?.stockConsumableQty || 0})`,
        });

        return;
      }
    }

    setIsSubmitting(true);

    try {
      await actions[actionKey].exec(user.uid, data, subjectVineyard);
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    if (!filteredVineyards || filteredVineyards.length === 0) return;

    const vineyardActionSample = {
      ...vineyardGlobalActionSample,
      id: crypto.randomUUID(),
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: userId,
      type: actionKey as VineyardActionType,
      executionDate: Timestamp.fromDate(new Date()),
      inUseVineyard: {
        id: filteredVineyards.length === 1 ? filteredVineyards[0].id : "",
        name: filteredVineyards.length === 1 ? filteredVineyards[0].name : "",
      },
      supportingDocuments: [],
    };

    reset(vineyardActionSample);
    setFormData(vineyardActionSample);
  }, [actionKey, filteredVineyards, reset, userId]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS:", errors);
    }
  }, [errors]);

  const filteredConsumables = useMemo(
    () =>
      allConsumables.filter(
        ({ id, rowType, qty = 0 }) =>
          rowType === "item" &&
          qty > 0 &&
          !formData.consumables?.some((consumable) => consumable.id === id)
      ),
    [allConsumables, formData.consumables]
  );

  const filteredChemistry = useMemo(
    () =>
      allChemistry.filter(
        ({ id, rowType, qty = 0 }) =>
          rowType === "item" &&
          qty > 0 &&
          !formData.chemistry?.some((chemistryItem) => chemistryItem.id === id)
      ),
    [allChemistry, formData.chemistry]
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

            <Stack gap={1}>
              <InputLabel className="text-sm text-muted-foreground">
                Selected vineyard
              </InputLabel>

              <Autocomplete<Vineyard, false, false, false>
                noOptionsText="No vineyards available"
                options={filteredVineyards}
                value={(formData?.inUseVineyard as Vineyard) || null}
                getOptionLabel={({ name }) => name}
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
                      (errors?.inUseVineyard as any)?.name?.message) as string
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
                label="Execution date"
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
                  {errors.executionDate.message as string}
                </Typography>
              )}
            </Stack>

            <Stack gap={1}>
              <InputLabel className="text-sm text-muted-foreground">
                Enter the responsible person
              </InputLabel>

              <FormControl fullWidth>
                <ResponsibleTeamMemberField
                  teamMembers={teamMembers}
                  onChange={(value) => {
                    if (!value) return;

                    const responsible = teamMembers.find(({ name }) =>
                      value.startsWith(name)
                    );

                    handleChange("responsible", responsible);
                  }}
                  currentValue={
                    formData?.responsible?.name !== undefined &&
                    formData?.responsible?.lastName !== undefined
                      ? `${formData?.responsible?.name} ${formData?.responsible?.lastName}`
                      : ""
                  }
                />
              </FormControl>

              {errors?.responsible?.message && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors.responsible.message as string}
                </Typography>
              )}
            </Stack>

            {["fertilizer-application", "pesticide-application"].includes(
              actionKey
            ) && (
              <Stack gap={1}>
                <InputLabel className="text-sm text-muted-foreground">
                  Enter the chemistry used
                </InputLabel>

                <Autocomplete
                  multiple
                  noOptionsText="No chemistry available"
                  options={filteredChemistry}
                  value={[]}
                  getOptionLabel={(option) => option.name}
                  filterSelectedOptions
                  onChange={(_event, newValue) => {
                    const added = newValue.at(-1);
                    if (!added) return;

                    const { id, name, qty = 0 } = added;

                    const updated = [
                      ...(formData.chemistry ?? []),
                      { id, name, qty: 1, stockChemistryQty: qty },
                    ];

                    handleChange("chemistry", updated);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Chemistry used"
                    />
                  )}
                />

                {(formData?.chemistry || []).length > 0 && (
                  <Stack
                    p={2}
                    pb={1}
                    gap={1}
                    sx={{
                      border: "1px solid var(--mui-palette-divider)",
                    }}
                  >
                    {formData?.chemistry?.map(
                      (
                        { id, name, qty = "", stockChemistryQty = 0 },
                        index
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
                                label="Qty (kg)"
                                type="number"
                                variant="outlined"
                                value={qty}
                                slotProps={{
                                  htmlInput: {
                                    min: 1,
                                    step: 0.01,
                                  },
                                }}
                                sx={{ width: "80px" }}
                                onChange={(e) => {
                                  const updated = [
                                    ...(formData.chemistry || []),
                                  ];
                                  updated[index].qty = Number(e.target.value);
                                  handleChange("chemistry", updated);
                                }}
                              />
                            </FormControl>

                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ width: "40px" }}
                            >
                              /&nbsp;{stockChemistryQty}
                            </Typography>

                            <IconButton
                              size="small"
                              disabled={false}
                              onClick={() => {
                                const updated = formData.chemistry?.filter(
                                  (item) => item.id !== id
                                );
                                handleChange("chemistry", updated);
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
                            {errors?.chemistry &&
                              Array.isArray(errors?.chemistry) &&
                              (errors?.chemistry[index]?.qty
                                ?.message as string)}
                          </Typography>
                        </Fragment>
                      )
                    )}
                  </Stack>
                )}

                {errors?.chemistry?.message && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors.chemistry.message as string}
                  </Typography>
                )}
              </Stack>
            )}
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
                    ({ id, name, qty = "", stockConsumableQty = 0 }, index) => (
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
                                (item) => item.id !== id
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
                    )
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
                    newValue.map(({ id, name }) => ({ id, name }))
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

              {errors?.additionalInformation?.message && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors.additionalInformation.message as string}
                </Typography>
              )}
            </Stack>

            <Stack gap={1}>
              <InputLabel className="text-sm text-muted-foreground">
                Supporting Documents
              </InputLabel>

              {isUploading && (
                <LinearProgress variant="determinate" value={uploadProgress} />
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
                  {errors.supportingDocuments.message as string}
                </Typography>
              )}
              <div ref={supportingDocumentsRef}></div>
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
