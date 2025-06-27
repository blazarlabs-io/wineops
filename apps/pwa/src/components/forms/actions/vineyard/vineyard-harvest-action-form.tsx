/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardHarvestActionSample } from "@/data/actions-samples";
import { useAuth } from "@/lib/firebase/auth";
import { vineyardHarvestActionSchema } from "@/models/schemas/actions/vineyard-harvest-action-schema";
import {
  ActionRelation,
  VineyardGlobalAction,
  VineyardHarvestAction,
} from "@/models/types/actions";
import { Vineyard, VineyardStatus } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useConsumable } from "@/context/consumable";
import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { countries } from "@/data/countries";
import { useGetVineyardsNames } from "@/hooks/use-get-vineyards-names";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { cleanUndefined } from "@/utils/clean-undefined";
import { ExpandMore } from "@mui/icons-material";
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
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";

const equipment: ActionRelation[] = [];

export default function VineyardHarvestActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vineyards, actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  ) as Vineyard[];

  const { user } = useAuth();
  const { grapes } = useGrape();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardHarvestActionSchema),
  });
  const { mode } = useColorScheme();
  const { teamMembers } = useWinery();
  const [formData, setFormData] = useState<VineyardHarvestAction>(
    vineyardHarvestActionSample
  );
  const { labReports: labData } = useVineyard();
  const { consumables } = useConsumable();
  const { vineyardNames } = useGetVineyardsNames(vineyards);

  const [disableSubject, setDisableSubject] = useState<boolean>(false);
  const [localVineyard, setLocalVineyard] = useState<Vineyard | null>(null);
  const [harvestEnded, setHarvestEnded] = useState<boolean>(false);

  // ! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // const handleChange = useCallback(
  //     (name: string, value: any) => {
  //       // console.log("NAME", name, value);
  //       if (name.startsWith("consumables")) {
  //         const data = consumables?.filter((v) => v.consumableID === value[0]);
  //         const newValue = {
  //           id: data[0]?.id,
  //           name: data[0]?.consumableID as string,
  //           qty: data[0]?.qty as number,
  //         };
  //         if (formData.consumables === undefined) formData.consumables = [];
  //         // formData?.consumables?.push(newValue);
  //         const _consumables = [
  //           ...(formData.consumables as {
  //             name: string;
  //             id: string;
  //             qty: number;
  //           }[]),
  //           newValue,
  //         ];
  //         setFormData((prev) => ({
  //           ...(prev as VineyardGlobalAction),
  //           consumables: _consumables,
  //         }));

  //         setValue("consumables", _consumables);

  //         return;
  //       }
  //       setFormData((prev) => ({
  //         ...(prev as VineyardGlobalAction),
  //         [name]: value,
  //       }));
  //     },
  //     [consumables, formData]
  //   );

  function removeByIndex<T>(array: T[], index: number): T[] {
    if (index < 0 || index >= array.length) return array; // index out of bounds
    const result = [...array.slice(0, index), ...array.slice(index + 1)];
    console.log("result", result);
    return result;
  }

  const handleDeleteFromList = useCallback(
    (value: string, index: number) => {
      console.log("VALUE", value, index);
      if (formData?.consumables && formData?.consumables?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          consumables: removeByIndex(formData.consumables as any, index),
        }));
      }
    },
    [formData]
  );

  const handleQtyChange = useCallback(
    (index: number, value: any) => {
      if (formData?.consumables && formData?.consumables?.length > 0) {
        const data = formData.consumables as any;
        data[index].qty = value;
        setFormData((prev) => ({
          ...(prev as VineyardHarvestAction),
          consumables: data,
        }));
      }
    },
    [formData]
  );

  // ! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
        console.log("DATE", value);
      }

      if (name === "subject.name") {
        //value = Timestamp.fromDate(value.toDate());
        const selected = vineyards.filter((v) => v.name === value)[0];

        value = {
          id: selected?.id as string,
          name: selected?.name as string,
        };

        setValue("subject.id" as string, value.id as string);
        setValue("subject.name" as string, value.name as any);
        setValue(name as string, value as ActionRelation[]);
        setFormData({ ...formData, subject: value });
        setLocalVineyard(selected as Vineyard);

        return;
      } else if (name === "consumables") {
        const data = consumables?.filter((v) => v.consumableID === value[0]);
        const newValue = {
          id: data[0]?.id,
          name: data[0]?.consumableID as string,
          qty: data[0]?.qty as number,
        };
        if (formData.consumables === undefined) formData.consumables = [];
        // formData?.consumables?.push(newValue);
        const _consumables = [
          ...(formData.consumables as {
            name: string;
            id: string;
            qty: number;
          }[]),
          newValue,
        ];
        setFormData((prev) => ({
          ...(prev as VineyardHarvestAction),
          consumables: _consumables,
        }));

        setValue("consumables", _consumables);

        return;
        // const prevConsumables =
        //   (formData.consumables as ActionRelation[]) || [];

        // // * Check if the consumable is already in the list
        // const alreadyInList = prevConsumables.find((c) => c.name === value);

        // console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXX");
        // console.log("prevConsumables", prevConsumables);
        // console.log("alreadyInList", alreadyInList);
        // console.log("XXXXXXXXXXXXXXXXXXXXXXXXX\n\n");

        // if (alreadyInList !== undefined) {
        //   console.log("\n\n already in list: LEAVE AS IS");
        //   value = [alreadyInList] as ActionRelation[];
        // } else if (prevConsumables.length === 0) {
        //   // add consumable to list
        //   console.log("\n\n not in list and prevConsumables is empty: ADD");
        //   const newConsumable = {
        //     id: consumables.filter((c) => c.name === value)[0].id,
        //     name: value,
        //   };
        //   value = [...prevConsumables, newConsumable] as ActionRelation[];
        // } else {
        //   // remove consumable from list
        //   console.log(
        //     "\n\n not in list and prevConsumables is not empty: DELETE"
        //   );
        //   value = prevConsumables.slice(0, -1) as ActionRelation[];
        // }

        // console.log("\n\n----------------------------");
        // console.log("value", value);
        // console.log("----------------------------\n\n");

        // setValue("consumables" as string, value as ActionRelation[]);
        // setFormData((prevData: VineyardHarvestAction) => {
        //   return {
        //     ...prevData,
        //     consumables: value,
        //   };
        // });
        // return;
      } else if (name === "sugar" && value === "acidity") {
        value = {
          id: "",
          name: "",
          value: value,
          variation: 0,
          unit: "g/dm³",
          responsible: { name: "", email: "" },
          date: new Date().toDateString(),
        };

        setValue(name as string, value);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            [name]: value,
          };
        });
        return;
      } else if (name === "location") {
        setValue("location" as string, value as string);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            location: value,
          };
        });
        return;
      } else if (name === "responsible") {
        const selectedMember = teamMembers.filter((m) => m.name === value)[0];
        setValue("responsible" as string, selectedMember);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            responsible: selectedMember,
          };
        });
        return;
      } else if (name === "sugar.value") {
        setValue("sugar.value" as string, value as number);
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
        setValue("acidity.value" as string, value as number);
        setFormData((prevData: VineyardHarvestAction) => {
          return {
            ...prevData,
            acidity: {
              ...prevData.acidity,
              value: value,
            },
          };
        });
      }
    },
    [consumables, formData, setValue, vineyards]
  );

  const onSubmit = useCallback(
    async (data: any, e: any) => {
      e.stopPropagation();
      e.preventDefault();

      const selected = vineyards.filter((v) => v.id === localVineyard?.id)[0];

      console.log("SUBMIT", user?.uid, data, selected);
      console.log("ERRORS:", errors);

      const cleanData = cleanUndefined(data);

      console.log("CLEANED", cleanData);

      setIsSubmitting(true);

      try {
        await actions?.harvest.exec(user?.uid as string, cleanData, selected);
      } finally {
        setIsSubmitting(false);
      }

      setFormData(data);

      onBackClick?.();
    },
    [actions?.harvest, errors, localVineyard?.id, user?.uid, vineyards]
  );

  useEffect(() => {
    if (localVineyard) {
      vineyardHarvestActionSample.consumables = [];

      vineyardHarvestActionSample.subject = {
        id: formData.subject.id,
        name: formData.subject.name,
      };

      const selected = vineyards.filter((v) => v.id === formData.subject.id)[0];

      // ? We get the corresponding lab report
      const labReport = labData?.filter((l) =>
        selected?.labData?.some((ld) => ld.id === l.id)
      )[0];

      let sugar, acidity, date;

      if (labReport?.results?.sugar.value === undefined) {
        sugar = 0;
      } else {
        sugar = labReport?.results?.sugar.value;
      }

      if (labReport?.results?.acidity.value === undefined) {
        acidity = 0;
      } else {
        acidity = labReport?.results?.acidity.value;
      }

      vineyardHarvestActionSample.sugar = {
        id: labReport?.id,
        name: "",
        value: labReport?.results?.sugar?.value ?? 0,
        variation: labReport?.results?.sugar?.variation,
        date: labReport?.date || Timestamp.now(),
        unit: (labReport?.units?.[0] as string as string) || "",
      };

      vineyardHarvestActionSample.acidity = {
        id: labReport?.id,
        name: "",
        value: labReport?.results?.acidity?.value ?? 0,
        variation: labReport?.results?.acidity?.variation,
        date: labReport?.date || Timestamp.now(),
        unit: (labReport?.units?.[0] as string) || "",
      };

      setHarvestEnded(selected.status === VineyardStatus.HARVEST_ENDED);

      //  * We get all batches data belonging to the selected vineyard
      const withBatches = grapes.filter((g) =>
        selected?.batches?.some((b: ActionRelation) => b.id === g.id)
      );

      // * We calculate the total weight
      const totalWeight = withBatches.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.metrics?.actual || 0),
        0
      );

      vineyardHarvestActionSample.weight = totalWeight;

      const result = {
        ...formData,
        ...vineyardHarvestActionSample,
      };

      console.log("result", result);

      setFormData(result);
      reset(result);
    }
  }, [localVineyard]);

  useEffect(() => {
    // * General
    vineyardHarvestActionSample.id = Date.now().toString();
    vineyardHarvestActionSample.batchId = `BatchID_${grapes?.length + 1}`;
    vineyardHarvestActionSample.type = "harvest";
    vineyardHarvestActionSample.weight = 0;
    vineyardHarvestActionSample.executionDate = new Date().toDateString();
    vineyardHarvestActionSample.equipment = [];
    vineyardHarvestActionSample.consumables = [];
    vineyardHarvestActionSample.sugar.value = 0;
    vineyardHarvestActionSample.sugar.date = Timestamp.now();
    if (vineyardHarvestActionSample.acidity?.value) {
      vineyardHarvestActionSample.acidity.value = 0;
      vineyardHarvestActionSample.acidity.date = Timestamp.now();
    }
    // * One vineyard is selected
    if (selectedVineyards && selectedVineyards.length === 1) {
      setDisableSubject(true);

      vineyardHarvestActionSample.subject = {
        id: selectedVineyards[0].id,
        name: selectedVineyards[0].name,
      };

      setLocalVineyard(selectedVineyards[0]);

      // ? We get the corresponding lab report
      const labReport = labData?.filter((l) =>
        selectedVineyards[0]?.labData?.some((ld) => ld.id === l.id)
      )[0];

      vineyardHarvestActionSample.sugar = {
        id: labReport?.id,
        name: "",
        value: labReport?.results?.sugar?.value ?? 0,
        variation: labReport?.results?.sugar?.variation,
        date: labReport?.date || new Date().toDateString(),
        unit: (labReport?.units?.[0] as string as string) || "",
      };

      vineyardHarvestActionSample.acidity = {
        id: labReport?.id,
        name: "",
        value: labReport?.results?.acidity?.value ?? 0,
        variation: labReport?.results?.acidity?.variation,
        date: labReport?.date || new Date().toDateString(),
        unit: (labReport?.units?.[0] as string) || "",
      };

      vineyardHarvestActionSample.harvestEnded =
        selectedVineyards[0].status === VineyardStatus.HARVEST_ENDED;

      setHarvestEnded(vineyardHarvestActionSample.harvestEnded);

      console.log("LAB REPORT", vineyardHarvestActionSample);

      //  * We get all batches data belonging to the selected vineyard
      const withBatches = grapes.filter((g) =>
        selectedVineyards[0]?.batches?.some(
          (b: ActionRelation) => b.id === g.id
        )
      );

      // * We calculate the total weight
      const totalWeight = withBatches.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.metrics?.actual || 0),
        0
      );

      // * We set the total weight
      vineyardHarvestActionSample.weight = totalWeight;

      console.log(
        "vineyardHarvestActionSample",
        withBatches,
        vineyardHarvestActionSample
      );
    } else {
      setDisableSubject(false);
    }

    setFormData(vineyardHarvestActionSample);
    reset(vineyardHarvestActionSample);
  }, [selectedVineyards]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  useEffect(() => {}, []);

  return (
    <>
      {formData && formData !== undefined && (
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
                p: 2,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <div className="flex flex-col gap-4 w-full">
                {/* * ID - HIDDEN */}
                <div className="hidden">
                  {/* <Label htmlFor="id">Id</Label> */}
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
                    background:
                      mode === "dark"
                        ? "#121212 !important"
                        : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
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
                    {/* * ACTION SUBJECT */}
                    <Stack display={"flex"} direction={"column"} gap={1}>
                      <Typography variant="body2" color="textSecondary">
                        Selected vineyard
                      </Typography>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="subject.name"
                          disabled={disableSubject}
                          options={vineyardNames || []}
                          value={localVineyard?.name || ""}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField {...params} label="Vineyard" />
                          )}
                          onChange={(e, value) => {
                            handleChange("subject.name", value as string);
                          }}
                        />
                        {/* <InputLabel id="subject-select">Vineyard</InputLabel> */}
                        {/* <Select
                          disabled={disableSubject}
                          name="subject.name"
                          // labelId="subject-select"
                          id="subject-select"
                          value={(formData.subject.name as string) || ""}
                          label="Vineyard"
                          onChange={(e) =>
                            handleChange("subject.name", e.target.value)
                          }
                        >
                          {vineyardNames &&
                            vineyardNames.length > 0 &&
                            vineyardNames.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                        </Select> */}
                      </FormControl>
                    </Stack>
                    {/* * EXECUTION DATE */}
                    {/* TODO allow past dates */}
                    <Stack gap={1} className="w-full">
                      <DatePicker
                        name="executionDate"
                        value={
                          formData.executionDate instanceof Timestamp
                            ? dayjs(formData.executionDate.toDate())
                            : dayjs(formData.executionDate)
                        }
                        label="Execution Date"
                        views={["year", "month", "day"]}
                        className="w-full"
                        onChange={(date) => {
                          if (date) {
                            handleChange("executionDate", date);
                          } else {
                            handleChange("executionDate", undefined);
                          }
                        }}
                      />
                    </Stack>
                    {/* * BATCH */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the Batch ID
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            label="Batch ID"
                            variant="outlined"
                            {...register("batchId")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                    <Stack display={"flex"} direction={"column"} gap={1}>
                      <Typography variant="body2" color="textSecondary">
                        Enter the weight (Kg)
                      </Typography>
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          label="Weight (Kg)"
                          variant="outlined"
                          inputProps={{
                            min: "0",
                            step: "0.01",
                          }}
                          {...register("weight")}
                        />
                      </FormControl>
                    </Stack>
                    {/* * RESPONSIBLE */}
                    <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the responsible person
                        </Typography>
                        <ResponsibleTeamMemberField
                          teamMembers={teamMembers}
                          onChange={(value) => {
                            handleChange("responsible.name", value);
                          }}
                        />
                      </Stack>
                    </FormControl>
                    {/* * CONSUMABLE */}
                    {/* TODO: multiple consumables and show quantity */}
                    {/* ! Checkout primary-vinification decant action form for custom component */}
                    <div className="flex flex-col gap-2">
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter the consumables used
                      </InputLabel>

                      <Autocomplete
                        multiple
                        noOptionsText="No vessels available"
                        options={consumables?.map((v) => v.consumableID)}
                        value={[]}
                        filterSelectedOptions
                        onChange={(_event, newValue) => {
                          handleChange("consumables", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Consumables used"
                          />
                        )}
                      />

                      {(formData.consumables || []).length > 0 && (
                        <Stack
                          p={2}
                          pb={1}
                          gap={1}
                          sx={{
                            border: "1px solid var(--mui-palette-divider)",
                          }}
                        >
                          {formData.consumables?.map(
                            ({ id, name = "", qty }, index) => (
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
                                      value={qty || 0}
                                      slotProps={{
                                        htmlInput: { min: 1, step: "any" },
                                      }}
                                      sx={{ width: "80px" }}
                                      onChange={(e) => {
                                        const updated: VineyardGlobalAction["consumables"] =
                                          [...(formData.consumables || [])];
                                        updated[index].qty = Number(
                                          e.target.value
                                        );
                                        console.log("UPDATED", e.target.value);
                                        handleQtyChange(
                                          index,
                                          Number(e.target.value)
                                        );
                                      }}
                                    />
                                  </FormControl>

                                  <IconButton
                                    size="small"
                                    disabled={false}
                                    onClick={() => {
                                      handleDeleteFromList(
                                        "consumables",
                                        index
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

                      {errors?.consumables && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.consumables?.message as string}
                        </Typography>
                      )}
                    </div>
                    {/* <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the consumables used
                        </Typography>
                        <Autocomplete
                          id="consumables"
                          options={consumables.map((item) => item.name)}
                          value={
                            (formData?.consumables !== undefined &&
                              (formData?.consumables?.map(
                                (item) => item.name
                              )[0] as string)) ||
                            ""
                          }
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField {...params} label="Consumables used" />
                          )}
                          onChange={(e, value) => {
                            handleChange("consumables", value as string);
                          }}
                        />
                      </Stack>
                    </FormControl> */}
                    {/* * TOOLS & EQUIPMENT */}
                    <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Select the tools&equipment used
                        </Typography>
                        <Autocomplete
                          disabled
                          id="equipment"
                          multiple
                          options={equipment.map((item) => item.name)}
                          value={formData?.equipment?.map((item) => item.name)}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Tools & equipment used"
                            />
                          )}
                          onChange={(e, value) => {
                            // handleChange("responsible.name", value as string);
                          }}
                        />
                      </Stack>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                {/* * TRANSPORTATION INFO */}
                <Accordion
                  sx={{
                    background:
                      mode === "dark"
                        ? "#121212 !important"
                        : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
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
                    {/* * LOCATION */}
                    {/* TODO: a predefined user list of locations shoudl exist in DB. If not, the create one using the new location input */}
                    <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Select the processing location
                        </Typography>
                        <Autocomplete
                          id="location"
                          options={countries.map((item) => item.name)}
                          value={formData?.location}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Processing location"
                            />
                          )}
                          onChange={(e, value) => {
                            handleChange("location", value as string);
                          }}
                        />
                      </Stack>
                    </FormControl>
                    {/* * DSIPATCH INVOICE */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the dispatch invoice
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            label="Dispatch Invoice"
                            variant="outlined"
                            {...register("invoiceNumber")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                    {/* * TANSPORTATION COMPANY */}
                    {/* TODO same behaviour as location */}
                    <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the transportation company name
                        </Typography>
                        {/* <Autocomplete
                          id="location"
                          options={countries.map((item) => item.name)}
                          value={formData?.location}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Processing location"
                            />
                          )}
                          onChange={(e, value) => {
                            // handleChange("location", value as string);
                          }}
                        /> */}
                        <TextField
                          id="outlined-basic"
                          label="Transportation Company"
                          variant="outlined"
                          {...register("transportCompanyName")}
                        />
                      </Stack>
                    </FormControl>
                    {/* * VEHICLE ID NUMBER */}
                    <FormControl fullWidth>
                      <Stack display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the vehicle registration number
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          label="Vehicle number"
                          variant="outlined"
                          {...register("transportVehicleId")}
                        />
                        {/* <Autocomplete
                          id="transportVehicleId"
                          options={[]}
                          // value={formData?.location}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField {...params} label="Vehicle number" />
                          )}
                          {...register("transportVehicleId")}
                          // onChange={(e, value) => {
                          //   handleChange("transportDriverName", value as string);
                          // }}
                        /> */}
                      </Stack>
                    </FormControl>
                    {/* * DRIVER'S NAME */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the driver&apos;s name
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            label="Driver's name"
                            variant="outlined"
                            {...register("transportDriverName")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* * QUALITY PARAMETERS */}
                <Accordion
                  sx={{
                    background:
                      mode === "dark"
                        ? "#121212 !important"
                        : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
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
                    {/* * MASS CONCENTRATION OF SUGARS */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the mass concentration of sugars (g/dm³)
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            label="Sugar (g/dm³)"
                            variant="outlined"
                            type="number"
                            inputProps={{ step: 0.01, min: 0, max: 10000 }}
                            {...register("sugar.value")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                    {/* * ACIDITY */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the acidity (g/dm³)
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            type="number"
                            label="Acidity (g/dm³)"
                            variant="outlined"
                            inputProps={{ step: 0.01, min: 0, max: 10000 }}
                            {...register("acidity.value")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                    {/* * CERTIFICATE DE INOFENSIVITATE */}
                    <div className="">
                      <Stack display={"flex"} direction={"column"} gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          Enter the certificat de inofensivitate ID
                        </Typography>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-basic"
                            label="Certificat de inofensivitate ID"
                            variant="outlined"
                            // {...register("invoice")}
                          />
                        </FormControl>
                      </Stack>
                    </div>
                  </AccordionDetails>
                </Accordion>
                {/* * ADDITIONAL INFORMATION */}
                <Accordion
                  sx={{
                    background:
                      mode === "dark"
                        ? "#121212 !important"
                        : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">
                      Additional Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body1">Description</Typography>
                    <TextareaAutosize
                      minRows={8}
                      placeholder="Description or additional information..."
                      style={{
                        width: "100%",
                        border: "1px solid",
                        borderColor: "var(--mui-palette-divider)",
                        borderRadius: "4px",
                        padding: "16px 8px",
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </div>
            </Box>

            <Box p={2} gap={2} display="flex" justifyContent="space-between">
              <Stack direction="row" spacing={0} alignItems="center">
                <Checkbox
                  checked={!!harvestEnded || false}
                  color="error"
                  // {...register("harvestEnded")}
                  onChange={(e) => {
                    setHarvestEnded(e.target.checked);
                    setValue("harvestEnded", e.target.checked);
                    setFormData({
                      ...formData,
                      harvestEnded: e.target.checked,
                    });
                  }}
                />
                <Typography variant="body1" color="textSecondary">
                  Harvest ended
                </Typography>
              </Stack>
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
      )}
    </>
  );
}
