"use client";

import { useVessel } from "@/context/vessel";
import { VOLUME_UNITS } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { vesselSchema } from "@/models/schemas/vessel-schema";
import {
  BarrelInfoUsage,
  DbResponse,
  FormMode,
  ToastLevel,
  Vessel,
  VesselType,
} from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { parseToDate } from "@/utils/date-format";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Accordion,
  AccordionDetails,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField as Input,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function VesselForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { vessels } = useVessel();
  const existingVessel = vessels?.find(({ id }) => id === selected[0]?.id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<Vessel>({
    resolver: joiResolver(vesselSchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Vessel | undefined>();

  const handleSelectChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Vessel, value);
      setFormData((prev) => ({ ...(prev as Vessel), [name]: value }));
    },
    [setValue],
  );

  const handleCreateVessel = useCallback(
    async (uid: string, data: any) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";

        if (data?.type === VesselType.BARREL) {
          data.barrelInfo = {
            ...data.barrelInfo,
            usageStatus: BarrelInfoUsage.NEW_VESSEL,
          };
        }
      }

      try {
        const getOneRes: DbResponse = await db.vessel.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
            ...(data?.type === VesselType.BARREL && {
              barrelInfo: {
                ...data?.barrelInfo,
                usageStatus:
                  data?.barrelInfo?.usageStatus || BarrelInfoUsage.NEW_VESSEL,
              },
            }),

            volumeUnit:
              data?.volume && data?.volumeUnit ? data?.volumeUnit : undefined,
          };

          const updateRes: DbResponse = await db.vessel.update(
            uid,
            id,
            newData,
          );

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error updating vessel`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.vessel.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating vessel`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e,
        );

        enqueueSnackbar(`Error creating vessel`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType],
  );

  const onSubmit = async (data: Vessel) => {
    setIsSubmitting(true);

    try {
      await handleCreateVessel(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const name = `Vessel_${vessels?.filter(({ rowType }) => rowType !== "group")?.length + 1}`;

    const formatted = {
      ...existingVessel,
      ...(!existingVessel && {
        id: Date.now().toString(),
        name,
        group: [name],
      }),
      ...(existingVessel?.type === VesselType.BARREL && {
        barrelInfo: {
          ...existingVessel?.barrelInfo,
          usageStatus:
            existingVessel?.barrelInfo?.usageStatus ||
            BarrelInfoUsage.NEW_VESSEL,
        },
      }),
    } as Vessel;

    reset(formatted);
    setFormData(formatted);
  }, [reset, vessels, existingVessel]);

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
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                        id={formData?.id as Vessel["id"]}
                        value={formData?.id || ""}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        id={formData?.usage as Vessel["usage"]}
                        value={formData?.usage || ""}
                        type="hidden"
                        {...register("usage")}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select vessel type:
                    </InputLabel>

                    <FormControl>
                      <Select
                        name="type"
                        id="type"
                        variant="outlined"
                        value={formData?.type ?? ""}
                        onChange={(e) =>
                          handleSelectChange("type", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {Object.values(VesselType).map((type) => {
                          return (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    {errors?.type && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.type?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter a reference ID for your vessel
                    </InputLabel>
                    <FormControl>
                      <Input
                        id="name"
                        label="ID"
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
                      Enter last maintenance date
                    </InputLabel>

                    <DatePicker
                      label="Last maintenance"
                      value={
                        formData?.lastMaintenance
                          ? dayjs(parseToDate(formData?.lastMaintenance))
                          : null
                      }
                      onChange={(newValue) =>
                        handleSelectChange(
                          "lastMaintenance",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : null,
                        )
                      }
                    />

                    {errors?.lastMaintenance && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.lastMaintenance?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter location
                    </InputLabel>

                    <Autocomplete
                      freeSolo
                      options={[]}
                      value={formData?.location || ""}
                      onChange={(_event, newValue) => {
                        handleSelectChange("location", newValue || "");
                      }}
                      onInputChange={(_event, newInputValue) => {
                        handleSelectChange("location", newInputValue || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="outlined"
                        />
                      )}
                    />
                    {errors?.location && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.location?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter volume
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="volume"
                          label="Volume"
                          type="number"
                          variant="outlined"
                          {...register("volume", {
                            setValueAs: (value) =>
                              value === "" ? undefined : parseFloat(value),
                          })}
                        />
                      </FormControl>

                      <FormControl sx={{ width: "100px" }}>
                        <InputLabel>Unit</InputLabel>
                        <Select
                          name="volumeUnit"
                          id="volumeUnit"
                          label="Unit"
                          variant="outlined"
                          value={formData?.volumeUnit || ""}
                          onChange={(e) =>
                            handleSelectChange(
                              "volumeUnit",
                              e.target.value || "",
                            )
                          }
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {VOLUME_UNITS.map((unit) => {
                            return (
                              <MenuItem key={unit} value={unit}>
                                {unit}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Stack>

                    {errors?.volume && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.volume?.message as string}
                      </Typography>
                    )}

                    {errors?.volumeUnit && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.volumeUnit?.message as string}
                      </Typography>
                    )}
                  </div>

                  {formData?.type === VesselType.BARREL && (
                    <>
                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Select barrel usage status
                        </InputLabel>

                        <FormControl>
                          <Controller
                            name="barrelInfo.usageStatus"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                id="barrelInfo.usageStatus"
                                variant="outlined"
                                value={
                                  field.value || BarrelInfoUsage.NEW_VESSEL
                                }
                                onChange={(e) =>
                                  field.onChange(e.target.value || "")
                                }
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {Object.values(BarrelInfoUsage).map(
                                  (status) => {
                                    return (
                                      <MenuItem key={status} value={status}>
                                        {status}
                                      </MenuItem>
                                    );
                                  },
                                )}
                              </Select>
                            )}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.usageStatus && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.barrelInfo?.usageStatus?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter barrel manufacturer
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="barrelInfo.manufacturer"
                            label="Barrel manufacturer"
                            type="text"
                            variant="outlined"
                            {...register("barrelInfo.manufacturer")}
                          />
                        </FormControl>
                        {errors?.barrelInfo?.manufacturer && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {
                              errors?.barrelInfo?.manufacturer
                                ?.message as string
                            }
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter barrel material
                        </InputLabel>

                        <FormControl>
                          <Input
                            id="barrelInfo.material"
                            label="Barrel material"
                            type="text"
                            variant="outlined"
                            {...register("barrelInfo.material")}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.material && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.barrelInfo?.material?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Select barrel toast level
                        </InputLabel>

                        <FormControl>
                          <Controller
                            name="barrelInfo.toastLevel"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                id="barrelInfo.toastLevel"
                                variant="outlined"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {Object.values(ToastLevel).map((status) => {
                                  return (
                                    <MenuItem key={status} value={status}>
                                      {status}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.toastLevel && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.barrelInfo?.toastLevel?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter thickness of staves
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="barrelInfo.stavesThickness"
                            label="Thickness of staves"
                            type="number"
                            variant="outlined"
                            {...register("barrelInfo.stavesThickness", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.stavesThickness && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {
                              errors?.barrelInfo?.stavesThickness
                                ?.message as string
                            }
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter oxygen transmission rate (OTR)
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="barrelInfo.oxygenTransmissionRate"
                            label="Oxygen transmission rate (OTR)"
                            type="number"
                            variant="outlined"
                            {...register("barrelInfo.oxygenTransmissionRate", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.oxygenTransmissionRate && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {
                              errors?.barrelInfo?.oxygenTransmissionRate
                                ?.message as string
                            }
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter wood grain density
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="barrelInfo.woodGrainDensity"
                            label="Wood grain density"
                            type="number"
                            variant="outlined"
                            {...register("barrelInfo.woodGrainDensity", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {errors?.barrelInfo?.woodGrainDensity && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {
                              errors?.barrelInfo?.woodGrainDensity
                                ?.message as string
                            }
                          </Typography>
                        )}
                      </div>
                    </>
                  )}

                  {formData?.type === VesselType.STAINLESS_STEEL_TANK && (
                    <>
                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Usage status
                        </InputLabel>

                        <Controller
                          name="sstInfo.usage"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              views={["year"]}
                              label="Usage status"
                              value={
                                field.value && !isNaN(parseInt(field.value))
                                  ? dayjs()
                                      .year(parseInt(field.value))
                                      .startOf("year")
                                  : null
                              }
                              onChange={(newValue) => {
                                field.onChange(
                                  newValue ? newValue?.year() : null,
                                );
                              }}
                              slotProps={{
                                textField: {
                                  variant: "outlined",
                                  fullWidth: true,
                                },
                              }}
                            />
                          )}
                        />
                        {errors?.sstInfo?.usage && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.sstInfo?.usage?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter material & grade
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="sstInfo.materialGrade"
                            label="Material & grade"
                            type="text"
                            variant="outlined"
                            {...register("sstInfo.materialGrade")}
                          />
                        </FormControl>

                        {errors?.sstInfo?.materialGrade && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.sstInfo?.materialGrade?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter thickness of the steel
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="sstInfo.steelThickness"
                            label="Thickness of the steel"
                            type="number"
                            variant="outlined"
                            {...register("sstInfo.steelThickness", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {errors?.sstInfo?.steelThickness && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.sstInfo?.steelThickness?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Controller
                          name="sstInfo.coolingJacketsCoils"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={!!field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                              }
                              label="Cooling jackets or coils"
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Controller
                          name="sstInfo.insulationLayers"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={!!field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                              }
                              label="Insulation layers"
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter pressure rating
                        </InputLabel>

                        <FormControl sx={{ flex: 1 }}>
                          <Input
                            id="sstInfo.pressureRating"
                            label="Pressure rating"
                            type="number"
                            variant="outlined"
                            {...register("sstInfo.pressureRating", {
                              setValueAs: (value) =>
                                value === "" ? undefined : parseFloat(value),
                            })}
                          />
                        </FormControl>

                        {errors?.sstInfo?.pressureRating && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.sstInfo?.pressureRating?.message as string}
                          </Typography>
                        )}
                      </div>
                    </>
                  )}
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
