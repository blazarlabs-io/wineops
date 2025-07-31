"use client";

import { GrapeProcessingAction, PressPercentage } from "@/models/types/actions";
import { Grape } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useGrape } from "@/context/grape";
import { useMust } from "@/context/must";
import { useVessel } from "@/context/vessel";
import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { useGetGrapesNames } from "@/hooks/use-get-grapes-names";
import { useAuth } from "@/lib/firebase/auth";
import { grapeProcessingActionSchema } from "@/models/schemas/actions/grape-processing-action-schema";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { Add, ExpandMore } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { parseToDate } from "@/utils/date-format";

export default function GrapeProcessingActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { grapes, actions } = useGrape();
  const { vessels } = useVessel();
  const { labReports } = useVineyard();

  const selectedGrapes = useSelectedEntitiesStore(
    ({ selected }) => selected,
  ) as Grape[];

  const { musts } = useMust();
  const { teamMembers } = useWinery();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    resolver: joiResolver(grapeProcessingActionSchema),
  });
  const { grapesNames } = useGetGrapesNames(grapes);
  const [formData, setFormData] = useState<GrapeProcessingAction>(
    {} as GrapeProcessingAction,
  );
  const [disableSubject, setDisableSubject] = useState<boolean>(false);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name, value);
      setFormData((prev) => ({
        ...(prev as GrapeProcessingAction),
        [name]: value,
      }));
    },
    [setValue],
  );

  const onSubmit = useCallback(
    async (data: any, e: any) => {
      e.stopPropagation();
      e.preventDefault();

      const totalPressPercentage = (data?.pressPercentage ?? []).reduce(
        (sum: number, { newPressPercentage = 0 }) => sum + newPressPercentage,
        0,
      );

      if (totalPressPercentage !== 100) {
        setError(`pressPercentage`, {
          type: "manual",
          message: `Total Press percentage % (${totalPressPercentage}) must be equal with 100%`,
        });

        return;
      }

      (data?.pressPercentage || []).forEach(
        (item: PressPercentage, index: number) => {
          const totalVesselsQty = (item.vessels ?? []).reduce(
            (sum: number, { qty = 0 }) => sum + qty,
            0,
          );

          if ((item?.inputQuantity || 0) === 0) {
            setError(`pressPercentage.${index}.inputQuantity`, {
              type: "manual",
              message: `Please enter a valid number for the must quantity`,
            });

            return;
          }

          if (totalVesselsQty !== (item?.inputQuantity || 0)) {
            setError(`pressPercentage.${index}.vessels`, {
              type: "manual",
              message: `Total vessels quantity (${totalVesselsQty}) must be equal with must quantity (${item.inputQuantity})`,
            });

            return;
          }

          return;
        },
      );

      const subjectGrape = grapes.find((g) => g?.name === data?.batchId);

      const grapeActual = subjectGrape?.metrics?.actual || 0;

      if (grapeActual <= 0) {
        setError(`quantity`, {
          type: "manual",
          message: `Batch quantity (${subjectGrape?.metrics?.actual}) must be greater than 0)`,
        });

        return;
      }

      if (grapeActual < (data?.quantity || 0)) {
        setError(`quantity`, {
          type: "manual",
          message: `Grape quantity (${data?.quantity || 0}) must be less or equal with batch quantity (${grapeActual})`,
        });

        return;
      }

      setIsSubmitting(true);

      try {
        await actions?.["grape-process"].exec(
          user?.uid as string,
          data,
          subjectGrape,
        );
      } finally {
        setIsSubmitting(false);
      }

      setFormData(data);

      onBackClick?.();
    },
    [actions, grapes, user?.uid, onBackClick],
  );

  useEffect(() => {
    const grapeProcessingActionSample: GrapeProcessingAction = {
      id: Date.now().toString(),
      batchId: "",
      type: "grape-process",
      quantity: undefined,
      executionDate: Timestamp.fromDate(new Date()),
      receivingBay: {},
      destemmer: {},
      press: {},
      pressPercentage: [],
      labReport: {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          id: "",
          name: "",
          email: "",
        },
        units: "",
        results: {
          sugar: {
            value: 0,
            variation: 0,
          },
          acidity: {
            value: 0,
            variation: 0,
          },
        },
      },
      wasteQuantity: undefined,
    };

    if (selectedGrapes && selectedGrapes.length === 1) {
      grapeProcessingActionSample.batchId = selectedGrapes[0].name;

      grapeProcessingActionSample.labReport = {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          id: teamMembers[0]?.id,
          name: teamMembers[0]?.name,
          email: teamMembers[0]?.email,
        },
        units: selectedGrapes[0]?.labData?.acidity?.unit as string,
        results: {
          sugar: {
            value: selectedGrapes[0]?.labData?.acidity?.value as number,
            variation: 0,
          },
          acidity: {
            value: selectedGrapes[0]?.labData?.acidity?.value as number,
            variation: 0,
          },
        },
      };
      setDisableSubject(true);
    } else if (grapes && grapes.length > 0) {
      grapeProcessingActionSample.batchId = grapes[0]?.name;

      grapeProcessingActionSample.labReport = {
        id: "",
        date: new Date().toDateString(),
        supportingDocs: [],
        responsible: {
          id: teamMembers[0]?.id,
          name: teamMembers[0]?.name,
          email: teamMembers[0]?.email,
        },
        units: grapes[0]?.labData?.acidity?.unit as string,
        results: {
          sugar: {
            value: grapes[0]?.labData?.acidity?.value as number,
            variation: 0,
          },
          acidity: {
            value: grapes[0]?.labData?.acidity?.value as number,
            variation: 0,
          },
        },
      };
      setDisableSubject(false);
    }

    if (labReports && labReports.length > 0) {
    } else {
    }

    reset(grapeProcessingActionSample);
    setFormData(grapeProcessingActionSample);
  }, [grapes, selectedGrapes]);

  const filteredMusts = musts.filter(({ rowType }) => rowType === "item");
  const filteredVessels = vessels.filter(({ rowType }) => rowType === "item");

  const handleAddPressPercentage = () => {
    const pressPercentage = {
      id: crypto.randomUUID(),
      mustId: `MustID_${filteredMusts.length + 1 + (formData?.pressPercentage || [])?.length}`,
      inputQuantity: undefined,
      vessels: [],
      newPressPercentage: undefined,
    };

    handleChange("pressPercentage", [
      ...(formData?.pressPercentage || []),
      pressPercentage,
    ]);
  };

  const totalPressPercentage = useMemo(
    () =>
      (formData.pressPercentage || []).reduce(
        (sum, item) => (sum += +(item.newPressPercentage || 0)),
        0,
      ),
    [formData.pressPercentage],
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
          className="w-full"
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col w-full">
              <Stack gap={2} sx={{ p: 2 }}>
                <div className="hidden">
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="id-field"
                      label="ID"
                      variant="outlined"
                      slotProps={{
                        htmlInput: { min: 1, step: 0.01, max: 1_000_000 },
                      }}
                      {...register("quantity")}
                    />
                  </FormControl>

                  {errors?.quantity && (
                    <Typography variant="body2" color="error" className="mt-1">
                      {errors?.quantity?.message as string}
                    </Typography>
                  )}
                </div>

                <FormControl fullWidth>
                  <InputLabel id="batchId-select">
                    {formData?.batchId ? "Selected batch ID" : "Batch ID"}
                  </InputLabel>
                  <Select
                    disabled={disableSubject}
                    name="batchId"
                    id="batchId-select"
                    value={(formData?.batchId as string) || ""}
                    label={formData?.batchId ? "Selected batch ID" : "Batch ID"}
                    onChange={(e) => {
                      handleChange("batchId", e.target.value);
                    }}
                  >
                    {grapesNames &&
                      grapesNames.length > 0 &&
                      grapesNames.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {errors?.batchId && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.batchId?.message as string}
                  </Typography>
                )}
                <Stack gap={1} className="w-full">
                  <DatePicker
                    name="executionDate"
                    value={
                      formData?.executionDate
                        ? dayjs(parseToDate(formData?.executionDate))
                        : null
                    }
                    label={
                      formData.executionDate
                        ? "Execution date"
                        : "Select execution date"
                    }
                    disablePast
                    views={["year", "month", "day"]}
                    className="w-full"
                    onChange={(date) => {
                      handleChange(
                        "executionDate",
                        date ? Timestamp.fromDate(date.toDate()) : null,
                      );
                    }}
                  />
                </Stack>

                {errors?.executionDate && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.executionDate?.message as string}
                  </Typography>
                )}

                <FormControl fullWidth>
                  <Stack display="flex" gap={1}>
                    <ResponsibleTeamMemberField
                      teamMembers={teamMembers}
                      onChange={(value) => {
                        handleChange("responsible", { name: value });
                      }}
                    />
                  </Stack>
                </FormControl>

                {errors?.responsible && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.responsible?.message as string}
                  </Typography>
                )}

                <div className="">
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="quantity"
                      label="Grape weight (Kg)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                      }}
                      {...register("quantity")}
                    />
                  </FormControl>
                </div>

                {errors?.quantity && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.quantity?.message as string}
                  </Typography>
                )}

                <FormControl>
                  <Autocomplete
                    options={[]}
                    value={formData?.receivingBay?.id || ""}
                    onChange={(_event, newValue) => {
                      handleChange("receivingBay", newValue || "");
                    }}
                    onInputChange={(_event, newInputValue) => {
                      handleChange("receivingBay", newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          formData?.receivingBay?.id
                            ? "Receiving bay"
                            : "Select a receiving bay"
                        }
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>

                {errors?.receivingBay && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.receivingBay?.message as string}
                  </Typography>
                )}

                <FormControl>
                  <Autocomplete
                    options={[]}
                    value={formData?.destemmer?.id || ""}
                    onChange={(_event, newValue) => {
                      handleChange("destemmer", newValue || "");
                    }}
                    onInputChange={(_event, newInputValue) => {
                      handleChange("destemmer", newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          formData?.destemmer?.id
                            ? "Destemmer"
                            : "Select a destemmer"
                        }
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>

                {errors?.destemmer && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.destemmer?.message as string}
                  </Typography>
                )}

                <FormControl>
                  <Autocomplete
                    options={[]}
                    value={formData?.press?.id || ""}
                    onChange={(_event, newValue) => {
                      handleChange("press", newValue || "");
                    }}
                    onInputChange={(_event, newInputValue) => {
                      handleChange("press", newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={formData?.press?.id ? "Press" : "Select a press"}
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>

                {errors?.press && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.press?.message as string}
                  </Typography>
                )}

                <div className="">
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="wasteQuantity"
                      label="Waste Quantity (Kg)"
                      variant="outlined"
                      slotProps={{
                        htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                      }}
                      {...register("wasteQuantity")}
                    />
                  </FormControl>
                </div>

                <Stack
                  direction="row"
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Typography variant="body1">
                    Press Percentage ({totalPressPercentage}%)
                  </Typography>

                  <Button
                    variant="text"
                    startIcon={<Add />}
                    onClick={handleAddPressPercentage}
                    disabled={totalPressPercentage >= 100}
                  >
                    Add
                  </Button>
                </Stack>

                {errors?.pressPercentage && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.pressPercentage?.message as string}
                  </Typography>
                )}
              </Stack>

              {formData.pressPercentage?.map((item, index) => (
                <Accordion
                  key={index}
                  disableGutters={true}
                  defaultExpanded={true}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`press-percentage${item.id}-content`}
                    id={`press-percentage${item.id}--header`}
                  >
                    <Typography component="span">
                      {item.newPressPercentage}%
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className="flex flex-col gap-4">
                      <FormControl fullWidth>
                        <TextField
                          id="pressPercentage.newPressPercentage"
                          label={
                            item.newPressPercentage
                              ? "New Press %"
                              : "Enter a % of press"
                          }
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 100 },
                          }}
                          value={item.newPressPercentage || ""}
                          onChange={(e) => {
                            const updated = [
                              ...(formData.pressPercentage || []),
                            ];

                            updated[index].newPressPercentage = Number(
                              e.target.value,
                            );

                            handleChange("pressPercentage", updated);
                          }}
                        />
                      </FormControl>

                      <Typography
                        key={`newPressPercentage-${index}`}
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.pressPercentage &&
                          Array.isArray(errors?.pressPercentage) &&
                          (errors?.pressPercentage[index]?.newPressPercentage
                            ?.message as string)}
                      </Typography>

                      <FormControl fullWidth>
                        <TextField
                          id="pressPercentage.mustId"
                          label="Must ID"
                          variant="outlined"
                          value={item.mustId || ""}
                          onChange={(e) => {
                            const updated = [
                              ...(formData.pressPercentage || []),
                            ];

                            updated[index].mustId = e.target.value;

                            handleChange("pressPercentage", updated);
                          }}
                        />
                      </FormControl>

                      <Typography
                        key={`mustId-${index}`}
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.pressPercentage &&
                          Array.isArray(errors?.pressPercentage) &&
                          (errors?.pressPercentage[index]?.mustId
                            ?.message as string)}
                      </Typography>

                      <FormControl fullWidth>
                        <TextField
                          id="pressPercentage.inputQuantity"
                          label="Must quantity (Kg)"
                          variant="outlined"
                          type="number"
                          slotProps={{
                            htmlInput: { min: 0, step: 0.01, max: 1_000_000 },
                          }}
                          value={item.inputQuantity || ""}
                          onChange={(e) => {
                            const updated = [
                              ...(formData.pressPercentage || []),
                            ];

                            updated[index].inputQuantity = Number(
                              e.target.value,
                            );

                            handleChange("pressPercentage", updated);
                          }}
                        />
                      </FormControl>

                      <Typography
                        key={`inputQuantity-${index}`}
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.pressPercentage &&
                          Array.isArray(errors?.pressPercentage) &&
                          (errors?.pressPercentage[index]?.inputQuantity
                            ?.message as string)}
                      </Typography>

                      <Stack gap={1}>
                        <Autocomplete
                          multiple
                          noOptionsText="No vessels available"
                          options={filteredVessels.filter(
                            (vessel) =>
                              !item?.vessels?.some(
                                ({ id }) => id === vessel.id,
                              ),
                          )}
                          value={[]}
                          getOptionLabel={(option) => option.name}
                          filterSelectedOptions
                          onChange={(_event, newValue) => {
                            const added = newValue.at(-1);

                            if (!added) return;

                            const updatedVessels = [
                              ...(item?.vessels ?? []),
                              {
                                id: added.id,
                                name: added.name,
                                type: added.type,
                                location: added.location,
                                qty: 1,
                              },
                            ];
                            const updated = [
                              ...(formData.pressPercentage || []),
                            ];

                            updated[index].vessels = updatedVessels;

                            handleChange("pressPercentage", updated);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Select vessel(s) for the must"
                            />
                          )}
                        />

                        {(item?.vessels || []).length > 0 && (
                          <>
                            <InputLabel className="text-sm text-muted-foreground">
                              Vessel(s):
                            </InputLabel>

                            <Stack
                              p={2}
                              pb={1}
                              gap={1}
                              sx={{
                                border: "1px solid var(--mui-palette-divider)",
                              }}
                            >
                              {item?.vessels?.map(
                                ({ id, name, qty = "" }, vesselsIndex) => (
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
                                        <TextField
                                          id="qty"
                                          size="small"
                                          label="Qty"
                                          type="number"
                                          variant="outlined"
                                          value={qty}
                                          slotProps={{
                                            htmlInput: {
                                              min: 0,
                                              step: 0.1,
                                              max: 1_000_000,
                                            },
                                          }}
                                          sx={{ width: "80px" }}
                                          onChange={(e) => {
                                            const updatedVessels = [
                                              ...(item.vessels || []),
                                            ];

                                            updatedVessels[vesselsIndex].qty =
                                              Number(e.target.value);

                                            const updated = [
                                              ...(formData.pressPercentage ||
                                                []),
                                            ];

                                            updated[index].vessels =
                                              updatedVessels;

                                            handleChange(
                                              "pressPercentage",
                                              updated,
                                            );
                                          }}
                                        />
                                      </FormControl>

                                      <IconButton
                                        size="small"
                                        disabled={false}
                                        onClick={() => {
                                          const updatedVessels =
                                            item.vessels?.filter(
                                              (vessel) => vessel.id !== id,
                                            );

                                          const updated = [
                                            ...(formData.pressPercentage || []),
                                          ];

                                          updated[index].vessels =
                                            updatedVessels;

                                          handleChange(
                                            "pressPercentage",
                                            updated,
                                          );
                                        }}
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    </Stack>

                                    <Typography
                                      key={`vessels-${index}-${vesselsIndex}`}
                                      variant="body2"
                                      color="error"
                                      className="mt-1"
                                    >
                                      {errors?.pressPercentage &&
                                        Array.isArray(
                                          errors?.pressPercentage,
                                        ) &&
                                        Array.isArray(
                                          errors?.pressPercentage[index]
                                            ?.vessels,
                                        ) &&
                                        (errors?.pressPercentage[index]
                                          ?.vessels[vesselsIndex]
                                          ?.message as string)}
                                    </Typography>
                                  </Fragment>
                                ),
                              )}
                            </Stack>
                          </>
                        )}
                      </Stack>

                      <Typography
                        key={`vessels-${index}`}
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.pressPercentage &&
                          Array.isArray(errors?.pressPercentage) &&
                          (errors?.pressPercentage[index]?.vessels
                            ?.message as string)}
                      </Typography>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </Box>

        <Box p={2} gap={2} display="flex" justifyContent="end">
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
