/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BottleWineAction,
  PackagingType,
  Recipe,
  VineyardGlobalAction,
} from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { bottleWineActionSchema } from "@/models/schemas/actions/bottle-wine-action-schema";
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
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
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
import { useWine } from "@/context/wine";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { Wine, Consumable, ConsumableCategory } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { File } from "lucide-react";
import { db } from "@/lib/firebase/services";
import ClearIcon from "@mui/icons-material/Clear";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { useConsumable } from "@/context/consumable";
import { hasKeyFromArray } from "../../utils";

export default function BottleWineActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [bottleSpecsExpanded, setBottleSpecsExpanded] = useState(false);
  const [finalLabExpanded, setFinalLabExpanded] = useState(false);
  const [quantityLossesExpanded, setQuantityLossesExpanded] = useState(false);

  const handleGeneralExpansion = () => {
    setGeneralExpanded((prevExpanded) => !prevExpanded);
  };

  const handleBottleSpecsExpansion = () => {
    setBottleSpecsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleFinalLabExpansion = () => {
    setFinalLabExpanded((prevExpanded) => !prevExpanded);
  };

  const handleQuantityLossesExpanded = () => {
    setQuantityLossesExpanded((prevExpanded) => !prevExpanded);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { wines, actions } = useWine();

  const { consumables } = useConsumable();

  const bottleTypes = consumables?.filter(
    ({ category }) => category === ConsumableCategory.BOTTLE
  );
  const closureTypes = [
    { id: "0", name: "Screw cap" },
    ...consumables?.filter(
      ({ category }) => category === ConsumableCategory.CORK
    ),
  ] as Consumable[];
  const capsuleTypes = consumables?.filter(
    ({ category }) => category === ConsumableCategory.CAPSULE
  );
  const labelTypes = consumables?.filter(
    ({ category }) => category === ConsumableCategory.LABEL
  );

  const selectedWines = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Wine[];

  const updatedSelectedWines = useMemo(
    () =>
      selectedWines.map(
        (selected) => wines.find((g) => g.id === selected.id) ?? selected
      ),
    [wines, selectedWines]
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: joiResolver(bottleWineActionSchema),
  });

  const filteredRecipes = useMemo(() => [] as Recipe[], []);

  const filteredWines = useMemo(
    () =>
      (updatedSelectedWines.length > 0 ? updatedSelectedWines : wines).filter(
        ({ rowType }) => rowType === "item"
      ),
    [wines, updatedSelectedWines]
  );

  const [formData, setFormData] = useState<BottleWineAction>(
    {} as BottleWineAction
  );
  const [disableSubject, setDisableSubject] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportingDocumentsRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (name: keyof BottleWineAction, value: any) => {
      setValue(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));

      /*if (name === "subjectRecipe.name") {
        const id = filteredWines.filter(({ name }) => name === value)[0].id;
        setValue("subjectRecipe.id", id);
        formData.subjectRecipe = {
          name: name,
          id: id,
        };
      }

      setValue(name, value);

      if (name.startsWith("executionDate")) {
        setFormData((prev) => ({
          ...(prev as BottleWineAction),
          [name]: value,
        }));
      } else {
        const path = name.split(".");
        const newFormData = setNestedValue(formData, path, value);
        setFormData(newFormData);
      }*/
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
        ...(prev as BottleWineAction),
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

      db.storage.uploadFile(
        file,
        user?.uid,
        "bottleWine",
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
        ...(prev as BottleWineAction),
        supportingDocuments: filesUrls,
      }));

      setValue("supportingDocuments", filesUrls);
      clearErrors("supportingDocuments");

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "bottleWine",
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
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectRecipe = filteredRecipes.filter(
      ({ name }) => name === data.subjectRecipe.name
    )[0];

    setIsSubmitting(true);

    try {
      await actions?.["bottle-a-wine"].exec(
        user?.uid as string,
        data,
        subjectRecipe
      );
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    const bottleWineActionSample: BottleWineAction = {
      id: crypto.randomUUID(),
      type: "bottle-a-wine",
      executionDate: Timestamp.fromDate(new Date()),
    } as BottleWineAction;

    if (
      filteredRecipes &&
      filteredRecipes.length === 1 &&
      bottleWineActionSample.subjectRecipe !== undefined
    ) {
      setDisableSubject(true);
      bottleWineActionSample.subjectRecipe.name = filteredRecipes[0]?.name;
      bottleWineActionSample.subjectRecipe.id = filteredRecipes[0]?.id;
    } else if (
      filteredRecipes &&
      filteredRecipes.length > 0 &&
      bottleWineActionSample.subjectRecipe !== undefined
    ) {
      setDisableSubject(false);
      bottleWineActionSample.subjectRecipe.name = filteredRecipes[0]?.name;
      bottleWineActionSample.subjectRecipe.id = filteredRecipes[0]?.id;
    }

    reset(bottleWineActionSample);
    setFormData(bottleWineActionSample);
  }, [filteredRecipes, reset, teamMembers]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);

      const hasGeneralErrors = hasKeyFromArray(
        ["executionDate", "wines"],
        errors
      );

      if (hasGeneralErrors) setGeneralExpanded(true);

      const hasBottleSpecsErrors = hasKeyFromArray(
        ["bottleType", "bottleSize", "closureType"],
        errors
      );

      if (hasBottleSpecsErrors) setBottleSpecsExpanded(true);

      const hasFinalLabErrors = hasKeyFromArray(
        ["alcohol", "sugar", "ph", "totalSO2", "freeSO2"],
        errors
      );

      if (hasFinalLabErrors) setFinalLabExpanded(true);

      const hasQuantityLossesErrors = hasKeyFromArray(
        ["numberOfBottles", "losses"],
        errors
      );

      if (hasQuantityLossesErrors) setQuantityLossesExpanded(true);
    }
  }, [errors]);

  useEffect(() => {
    if (formData) {
      console.log("formData", formData);
    }
  }, [formData]);

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
          className="w-full"
          sx={{
            py: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-4 w-full ">
            {/* * ID - HIDDEN */}
            <div className="hidden">
              {/* <Label htmlFor="id">Id</Label> */}
              <FormControl>
                <Input
                  id={formData.id as VineyardGlobalAction["id"]}
                  // value={formData.id}
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
                  <Stack gap={1} className="w-full">
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
                      disablePast
                      views={["year", "month", "day"]}
                      className="w-full"
                      onChange={(date) => {
                        handleChange(
                          "executionDate",
                          date ? Timestamp.fromDate(date.toDate()) : null
                        );

                        return;
                        if (date) {
                          handleChange("executionDate", date);
                        } else {
                          handleChange("executionDate", undefined);
                        }
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

                  <div className="flex flex-col gap-2">
                    <Autocomplete<Recipe, false, false, false>
                      noOptionsText="No recipes available"
                      options={[]}
                      value={(formData?.subjectRecipe as Recipe) || null}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("subjectRecipe", {
                          id: newValue.id,
                          name: newValue.name,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value ? "Recipe" : "Select recipe"
                          }
                        />
                      )}
                    />

                    {((errors?.subjectRecipe as any)?.id ||
                      (errors?.subjectRecipe as any)?.name) && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          ((errors?.subjectRecipe as any)?.id?.message ||
                            (errors?.subjectRecipe as any)?.name
                              ?.message) as string
                        }
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      multiple
                      noOptionsText="No wines available"
                      options={wines.filter(
                        (wine) =>
                          wine.rowType !== "group" &&
                          (wine?.qty || 0) > 0 &&
                          !formData.wines?.some(({ id }) => id === wine.id)
                      )}
                      value={[]}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        const added = newValue.at(-1);

                        if (!added) return;

                        const updated = [
                          ...(formData.wines ?? []),
                          {
                            id: added.id,
                            name: added.name,
                            actions: added?.actions,
                            qty: added.qty,
                            quantity: 1,
                          },
                        ];

                        handleChange("wines", updated);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Choose Wine"
                        />
                      )}
                    />

                    {(formData?.wines || []).length > 0 && (
                      <>
                        <Typography component="span">
                          Selected wines:
                        </Typography>
                        <Stack
                          p={2}
                          pb={1}
                          gap={1}
                          sx={{
                            border: "1px solid var(--mui-palette-divider)",
                          }}
                        >
                          {formData?.wines?.map(
                            ({ id, name, quantity = "" }, index) => (
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
                                      id="quantity"
                                      size="small"
                                      label="Quantity"
                                      type="number"
                                      variant="outlined"
                                      value={quantity}
                                      slotProps={{
                                        htmlInput: {
                                          min: 1,
                                          step: 0.01,
                                          max: 100_000_000,
                                        },
                                      }}
                                      sx={{ width: "80px" }}
                                      onChange={(e) => {
                                        const updated = [
                                          ...(formData.wines || []),
                                        ];

                                        updated[index].quantity = Number(
                                          e.target.value
                                        );

                                        handleChange("wines", updated);
                                      }}
                                    />
                                  </FormControl>
                                  <Typography sx={{ width: "60px" }}>
                                    /&nbsp;
                                    {wines?.find((wine) => wine.id === id)?.qty}
                                  </Typography>

                                  <IconButton
                                    size="small"
                                    disabled={false}
                                    onClick={() => {
                                      const updated = formData.wines?.filter(
                                        (wine) => wine.id !== id
                                      );

                                      handleChange("wines", updated);
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
                                  {errors?.wines &&
                                    Array.isArray(errors?.wines) &&
                                    (errors?.wines[index]?.quantity
                                      ?.message as string)}
                                </Typography>
                              </Fragment>
                            )
                          )}
                          <Typography variant="body2">
                            Quantity used:{" "}
                            {formData?.wines?.reduce(
                              (sum, wine) => (sum += wine?.quantity || 0),
                              0
                            )}
                          </Typography>
                        </Stack>
                      </>
                    )}

                    {errors?.wines && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.wines?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <ResponsibleTeamMemberField
                        teamMembers={teamMembers}
                        onChange={(value) => {
                          handleChange("responsible", value);
                        }}
                      />
                    </FormControl>

                    {errors?.responsible && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.responsible?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="bottlingLine"
                      options={[]}
                      noOptionsText="No bottling lines available"
                      value={formData?.bottlingLine}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bottling line"
                          variant="outlined"
                        />
                      )}
                      onChange={(_e, value) => {
                        handleChange("bottlingLine", value);
                      }}
                    />

                    {errors?.bottlingLine && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.bottlingLine?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={bottleSpecsExpanded}
              onChange={handleBottleSpecsExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`bottle-specifications-content`}
                id={`bottle-specifications-header`}
              >
                <Typography component="span">Bottle specifications</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="bottleType"
                      noOptionsText="No bottle types available"
                      options={bottleTypes.map(({ name }) => name)}
                      value={formData?.bottleType || null}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("bottleType", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Bottle type"
                              : "Select bottle type"
                          }
                        />
                      )}
                    />

                    {errors?.bottleType && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.bottleType?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="bottleSize"
                      noOptionsText="No bottle sizes available"
                      options={[0.375, 0.75]}
                      value={formData?.bottleSize || null}
                      getOptionLabel={(option) => `${option}`}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("bottleSize", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Bottle size"
                              : "Select bottle size"
                          }
                        />
                      )}
                    />

                    {errors?.bottleSize && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.bottleSize?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="closureType"
                      noOptionsText="No closure types available"
                      options={closureTypes.map(({ name }) => name)}
                      value={formData?.closureType || null}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("closureType", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Closure type"
                              : "Select closure type"
                          }
                        />
                      )}
                    />

                    {errors?.closureType && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.closureType?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="capsuleType"
                      noOptionsText="No capsule types available"
                      options={capsuleTypes.map(({ name }) => name)}
                      value={formData?.capsuleType || null}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("capsuleType", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Capsule type"
                              : "Select capsule type"
                          }
                        />
                      )}
                    />

                    {errors?.capsuleType && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.capsuleType?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="labelType"
                      noOptionsText="No label types available"
                      options={labelTypes.map(({ name }) => name)}
                      value={formData?.labelType || null}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("labelType", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Label type"
                              : "Select label type"
                          }
                        />
                      )}
                    />

                    {errors?.labelType && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.labelType?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        id="bottleWeight"
                        type="number"
                        label="Bottle weight (g)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 100_000 },
                        }}
                        {...register("bottleWeight")}
                      />
                    </FormControl>

                    {errors?.bottleWeight && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.bottleWeight?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters={true} defaultExpanded={false}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`packaging-details-content`}
                id={`packaging-details-header`}
              >
                <Typography component="span">Packaging details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <Autocomplete
                      id="packagingType"
                      noOptionsText="No packaging types available"
                      options={Object.values(PackagingType).map((name) => name)}
                      value={formData?.packagingType || null}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(_event, newValue) => {
                        if (!newValue) return;

                        handleChange("packagingType", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={
                            params.inputProps.value
                              ? "Packaging type"
                              : "Select packaging type"
                          }
                        />
                      )}
                    />

                    {errors?.packagingType && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.packagingType?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        id="bottlesPerBox"
                        type="number"
                        label="Bottles per box"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 1, max: 1000 },
                        }}
                        {...register("bottlesPerBox")}
                      />
                    </FormControl>

                    {errors?.bottlesPerBox && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.bottlesPerBox?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Input
                        id="packagingMaterial"
                        label="Material used"
                        type="text"
                        variant="outlined"
                        {...register("packagingMaterial")}
                      />
                    </FormControl>

                    {errors?.packagingMaterial && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.packagingMaterial?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Input
                        id="palletId"
                        label="Pallet ID"
                        type="text"
                        variant="outlined"
                        {...register("palletId")}
                      />
                    </FormControl>

                    {errors?.palletId && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.palletId?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={finalLabExpanded}
              onChange={handleFinalLabExpansion}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`final-lab-results-content`}
                id={`final-lab-results-header`}
              >
                <Typography component="span">Final Lab Results</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="alcohol"
                        label="Alcohol percentage (%)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("alcohol")}
                      />
                    </FormControl>

                    {errors?.alcohol && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.alcohol?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="sugar"
                        label="Wine sugar (g/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("sugar")}
                      />
                    </FormControl>

                    {errors?.sugar && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.sugar?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="pH"
                        label="pH"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("pH")}
                      />
                    </FormControl>

                    {errors?.pH && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.pH?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="totalSO2"
                        label="Total SO₂ (mg/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("totalSO2")}
                      />
                    </FormControl>

                    {errors?.totalSO2 && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.totalSO2?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="freeSO2"
                        label="Free SO₂ (mg/L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("freeSO2")}
                      />
                    </FormControl>

                    {errors?.freeSO2 && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.freeSO2?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="turbidity"
                        label="Turbidity (NTU)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                        }}
                        {...register("turbidity")}
                      />
                    </FormControl>

                    {errors?.turbidity && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.turbidity?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        id="labCertificateId"
                        label="Lab certificate ID"
                        variant="outlined"
                        {...register("labCertificateId")}
                      />
                    </FormControl>

                    {errors?.labCertificateId && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {(errors?.labCertificateId as any)?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters={true}
              defaultExpanded={false}
              expanded={quantityLossesExpanded}
              onChange={handleQuantityLossesExpanded}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`quantity-losses-content`}
                id={`quantity-losses-header`}
              >
                <Typography component="span">Quantity & Losses</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack gap={2}>
                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="numberOfBottles"
                        label="Number of bottles"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 1, max: 1_000_000_000 },
                        }}
                        {...register("numberOfBottles")}
                      />
                    </FormControl>

                    {errors?.numberOfBottles && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.numberOfBottles?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="losses"
                        label="Losses (L)"
                        variant="outlined"
                        slotProps={{
                          htmlInput: { min: 0, step: 1, max: 1_000_000_000 },
                        }}
                        {...register("losses")}
                      />
                    </FormControl>

                    {errors?.losses && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.losses?.message as string}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Stack p={2} gap={1}>
              <Typography variant="body2" color="text.secondary">
                Supporting Documents
              </Typography>

              {isUploading && (
                <LinearProgress variant="determinate" value={uploadProgress} />
              )}

              {formData.supportingDocuments &&
                formData.supportingDocuments.length > 0 &&
                formData.supportingDocuments.map((doc, index) => (
                  <Stack
                    key={doc.name}
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
                      <Typography variant="body2">{doc.name}</Typography>
                    </Stack>

                    <IconButton
                      size="small"
                      className="max-w-[24px] max-h-[24px]"
                      color="error"
                      onClick={() => handleDeleteFile(doc.name, index)}
                    >
                      <DeleteOutline className="max-w-4 max-h-4" />
                    </IconButton>
                  </Stack>
                ))}

              {errors?.supportingDocuments && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.supportingDocuments?.message as string}
                </Typography>
              )}
              <div ref={supportingDocumentsRef}></div>
            </Stack>
          </div>
        </Box>

        <Box p={2} gap={2} display="flex" justifyContent="space-between">
          <Button
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
