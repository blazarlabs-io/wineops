"use client";

import { MustDecantAction } from "@/models/types/actions";
import { Must } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useAuth } from "@/lib/firebase/auth";
import { mustDecantActionSchema } from "@/models/schemas/actions/must-decant-action-schema";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  TextField as Input,
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
import { Controller, useForm } from "react-hook-form";
import { useMust } from "@/context/must";
import { useVessel } from "@/context/vessel";
import ClearIcon from "@mui/icons-material/Clear";
import { useConsumable } from "@/context/consumable";
import { FormValue } from "../../types";
import { VOLUME_UNITS } from "@/data/constants";
import { parseToDate } from "@/utils/date-format";

const initialFormData: MustDecantAction = {
  id: "",
  type: "must-decant",
  mustId: "",
  vesselId: "",
  executionDate: "",
};

export default function MustDecantActionForm() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
    setError,
    watch,
  } = useForm<MustDecantAction>({
    resolver: joiResolver(mustDecantActionSchema),
  });

  const moveToWine = watch("moveToWine");

  const { musts: allMusts, selectedMusts, actions } = useMust();
  const filteredMusts = useMemo(
    () =>
      allMusts.filter(
        ({ rowType, vessels = [] }) =>
          rowType === "item" &&
          Array.isArray(vessels) &&
          vessels?.length > 0 &&
          vessels.reduce((sum, { qty = 0 }) => sum + qty, 0) > 0
      ),
    [allMusts]
  );

  const { vessels: allVessels } = useVessel();
  const { consumables: allConsumables } = useConsumable();

  const [formData, setFormData] = useState<MustDecantAction>(initialFormData);
  const [disableSubject, setDisableSubject] = useState<boolean>(false);

  const selectedMust = useMemo(
    () => filteredMusts.find(({ name }) => name === formData.mustId),
    [filteredMusts, formData.mustId]
  );

  const selectedMustsVessels = useMemo(
    () =>
      filteredMusts
        .flatMap(({ vessels = [] }) => vessels)
        .filter((vessel) => vessel),
    [filteredMusts]
  );

  const vesselsWithQty = (
    selectedMust ? selectedMust?.vessels : selectedMustsVessels
  )?.filter(({ qty = 0 }) => qty > 0);

  const filteredVessels = useMemo(
    () =>
      allVessels.filter(
        ({ id, rowType }) =>
          rowType === "item" &&
          vesselsWithQty?.map(({ id }) => id)?.includes(id)
      ),
    [allVessels, vesselsWithQty]
  );

  const handleSelectChange = useCallback(
    (name: keyof MustDecantAction, value: FormValue) => {
      setValue(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setValue]
  );

  const onSubmit = (data: MustDecantAction) => {
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const selectedQty =
      vesselsWithQty?.find(({ name }) => name === data?.vesselId)?.qty || 0;

    if (selectedQty < 0) {
      setError("vesselId", {
        type: "manual",
        message: `Vessel quantity must be greater than zero`,
      });

      return;
    }

    if ((data?.initialQty || 0) > selectedQty) {
      setError("initialQty", {
        type: "manual",
        message: `Initial quantity must be less or equal with ${selectedQty}`,
      });

      return;
    }

    if (
      data?.initialQty &&
      data?.obtainedWineQty &&
      data?.obtainedWineQty > data?.initialQty
    ) {
      setError("obtainedWineQty", {
        type: "manual",
        message: `Obtained quantity must be less or equal with ${data?.initialQty}`,
      });

      return;
    }

    const totalVesselQty = (data?.vessels ?? []).reduce(
      (sum, { qty = 0 }) => sum + qty,
      0
    );

    if (totalVesselQty > (data?.obtainedWineQty || 0)) {
      setError(`vessels.${0}.qty`, {
        type: "manual",
        message: `Total of vessel quantities (${totalVesselQty}) must be less than obtained quantity (${data.obtainedWineQty})`,
      });

      return;
    }

    const subjectMust = filteredMusts.find(({ name }) => name === data?.mustId);

    const subjectVessel = vesselsWithQty?.find(
      ({ name }) => name === data?.vesselId
    );

    if (!subjectMust) return;

    console.log("SUBJECT MUST", subjectMust);

    actions?.["must-decant"].exec(
      user?.uid as string,
      data,
      subjectMust,
      subjectVessel
    );

    setFormData(data);
  };

  useEffect(() => {
    const now = new Date();
    const mustDecantActionSample: MustDecantAction = {
      ...initialFormData,
      id: now.getTime().toString(),
      executionDate: Timestamp.fromDate(now),
    };

    if (selectedMusts?.length > 0) {
      mustDecantActionSample.mustId = selectedMusts[0].name;
      mustDecantActionSample.vesselId = selectedMusts[0].vesselName || "";
    }

    reset(mustDecantActionSample);
    setFormData(mustDecantActionSample);
  }, [reset, selectedMusts]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            <div className="hidden">
              <FormControl>
                <Input
                  id={formData.id as Must["id"]}
                  value={formData.id || ""}
                  type="hidden"
                  {...register("id")}
                />
              </FormControl>
            </div>

            <Stack gap={1} className="w-full">
              <DatePicker
                name="executionDate"
                value={
                  formData?.executionDate
                    ? dayjs(parseToDate(formData?.executionDate))
                    : null
                }
                label="Date"
                views={["year", "month", "day"]}
                className="w-full"
                onChange={(date) => {
                  handleSelectChange(
                    "executionDate",
                    date ? Timestamp.fromDate(date.toDate()) : undefined
                  );
                }}
              />

              {errors?.executionDate && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.executionDate?.message as string}
                </Typography>
              )}
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Must Name</InputLabel>
              <Select
                id="mustId"
                name="mustId"
                label="Must Name"
                value={formData?.mustId || ""}
                onChange={(e) => {
                  handleSelectChange("mustId", e.target.value);
                }}
                disabled={disableSubject}
              >
                {filteredMusts.map(({ id, name }) => (
                  <MenuItem key={id} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errors?.mustId && (
              <Typography variant="body2" color="error" className="mt-1">
                {errors?.mustId?.message as string}
              </Typography>
            )}

            <FormControl fullWidth>
              <InputLabel>Vessel Name</InputLabel>
              <Select
                id="vesselId"
                name="vesselId"
                label="Vessel Name"
                value={formData?.vesselId || ""}
                onChange={(e) => {
                  handleSelectChange("vesselId", e.target.value);
                }}
                disabled={disableSubject}
              >
                {filteredVessels.map(({ id, name }) => (
                  <MenuItem key={id} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errors?.vesselId && (
              <Typography variant="body2" color="error" className="mt-1">
                {errors?.vesselId?.message as string}
              </Typography>
            )}

            <div className="">
              <FormControl fullWidth>
                <TextField
                  id="initialQty"
                  type="number"
                  label="Initial Qty (Dal)"
                  variant="outlined"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  {...register("initialQty")}
                />
              </FormControl>

              {errors?.initialQty && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.initialQty?.message as string}
                </Typography>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Autocomplete
                multiple
                noOptionsText="No consumables available"
                options={allConsumables.filter(
                  (vessel) =>
                    vessel.rowType !== "group" &&
                    !formData.consumables?.some(({ id }) => id === vessel.id)
                )}
                value={[]}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                onChange={(_event, newValue) => {
                  const added = newValue.at(-1);
                  if (!added) return;
                  const updated = [
                    ...(formData.consumables ?? []),
                    { ...added, qty: 1 },
                  ];
                  handleSelectChange("consumables", updated);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Choose Consumable"
                  />
                )}
              />

              {(formData?.consumables || []).length > 0 && (
                <>
                  <Typography component="span">Consumables used:</Typography>
                  <Stack
                    p={2}
                    pb={1}
                    gap={1}
                    sx={{
                      border: "1px solid var(--mui-palette-divider)",
                    }}
                  >
                    {formData?.consumables?.map(
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
                                  htmlInput: { min: 1, step: 1 },
                                }}
                                sx={{ width: "80px" }}
                                onChange={(e) => {
                                  const updated = [
                                    ...(formData.consumables || []),
                                  ];
                                  updated[index].qty = Number(e.target.value);
                                  handleSelectChange("consumables", updated);
                                }}
                              />
                            </FormControl>

                            <IconButton
                              size="small"
                              disabled={false}
                              onClick={() => {
                                const updated = formData.consumables?.filter(
                                  (vessel) => vessel.id !== id
                                );
                                handleSelectChange("consumables", updated);
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
                </>
              )}

              {errors?.consumables && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.consumables?.message as string}
                </Typography>
              )}
            </div>

            <div className="">
              <FormControl fullWidth>
                <TextField
                  id="obtainedWineQty"
                  type="number"
                  label="Obtained Quantity (Dal)"
                  variant="outlined"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  {...register("obtainedWineQty", {
                    min: 0,
                    validate: (value) => {
                      if (typeof value !== "number") return true;

                      if (
                        value &&
                        formData?.initialQty &&
                        value >= formData.initialQty
                      ) {
                        return `Obtained quantity must be less or equal with ${formData.initialQty}`;
                      }

                      return true;
                    },
                  })}
                />
              </FormControl>

              {errors?.obtainedWineQty && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.obtainedWineQty?.message as string}
                </Typography>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Autocomplete
                multiple
                noOptionsText="No vessels available"
                options={allVessels.filter(
                  (vessel) =>
                    vessel.rowType !== "group" &&
                    !formData.vessels?.some(({ id }) => id === vessel.id)
                )}
                value={[]}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                onChange={(_event, newValue) => {
                  const added = newValue.at(-1);
                  if (!added) return;
                  const updated = [
                    ...(formData.vessels ?? []),
                    { ...added, qty: 1 },
                  ];
                  handleSelectChange("vessels", updated);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Choose Vessel"
                  />
                )}
              />

              {(formData?.vessels || []).length > 0 && (
                <>
                  <Typography component="span">Vessels used:</Typography>
                  <Stack
                    p={2}
                    pb={1}
                    gap={1}
                    sx={{
                      border: "1px solid var(--mui-palette-divider)",
                    }}
                  >
                    {formData?.vessels?.map(({ id, name, qty = "" }, index) => (
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
                              label="Qty (Dal)"
                              type="number"
                              variant="outlined"
                              value={qty}
                              slotProps={{
                                htmlInput: { min: 1, step: "any" },
                              }}
                              sx={{ width: "80px" }}
                              onChange={(e) => {
                                const updated = [...(formData.vessels || [])];
                                updated[index].qty = Number(e.target.value);
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
                            (errors?.vessels[index]?.qty?.message as string)}
                        </Typography>
                      </Fragment>
                    ))}
                  </Stack>
                </>
              )}

              {errors?.vessels && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.vessels?.message as string}
                </Typography>
              )}
            </div>

            <Stack direction="row" gap={2} alignItems="center">
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  id="wasteQuantity"
                  type="number"
                  label="Quantity of the Waste"
                  variant="outlined"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  {...register("wasteQuantity", {
                    min: 0,
                    validate: (value) => {
                      if (typeof value !== "number") return true;

                      if (
                        value &&
                        formData?.initialQty &&
                        value >= formData.initialQty
                      ) {
                        return `Waste quantity must be less or equal with ${formData.initialQty}`;
                      }

                      return true;
                    },
                  })}
                />
              </FormControl>

              <FormControl sx={{ width: "100px" }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="wasteUnit"
                  id="wasteUnit"
                  label="Unit"
                  variant="outlined"
                  value={formData?.wasteUnit || ""}
                  onChange={(e) =>
                    handleSelectChange("wasteUnit", e.target.value || "")
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {VOLUME_UNITS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {errors?.wasteUnit && (
              <Typography variant="body2" color="error" className="mt-1">
                {errors?.wasteUnit?.message as string}
              </Typography>
            )}

            <div className="">
              <FormControl fullWidth>
                <TextField
                  id="notes"
                  label="Notes"
                  variant="outlined"
                  {...register("notes")}
                />
              </FormControl>
            </div>

            <Stack>
              <Controller
                name="moveToWine"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Move to Secondary Vinification"
                  />
                )}
              />
            </Stack>

            <div className="">
              <FormControl fullWidth>
                <TextField
                  id="wineName"
                  label={moveToWine ? "Wine Name" : "New Must Name"}
                  variant="outlined"
                  {...register("wineName")}
                />
              </FormControl>

              {errors?.wineName && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors?.wineName?.message as string}
                </Typography>
              )}
            </div>
          </Stack>

          <Box py={2} display="flex" justifyContent="end">
            <FormControl>
              <Button type="submit" variant="contained" className="mt-8">
                Execute
              </Button>
            </FormControl>
          </Box>
        </form>
      )}
    </>
  );
}
