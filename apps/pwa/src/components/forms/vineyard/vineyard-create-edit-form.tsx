
"use client";

import PolygonDrawingMap from "@/components/widgets/maps/polygon-drawing-map";
import { useVineyard } from "@/context/vineyard";
import { countries } from "@/data/countries";
import { orientations, rowOrientations } from "@/data/system-variables";
import { setNestedValue } from "@/helpers/form-helpers";
import { useVineyardNameExists } from "@/hooks/use-vineyard-name-exists";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { vineyardSchema } from "@/models/schemas/vineyard-schema";
import {
  Coordinates,
  DbResponse,
  FormMode,
  Vineyard,
  VineyardStatus,
  WineColor,
} from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { generateYearsList } from "@/utils/generators";
import { joiResolver } from "@hookform/resolvers/joi";
import { Add, ExpandMore, ReceiptLong } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  TextField as Input,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useColorScheme,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Timestamp } from "firebase/firestore";
import { Leaf, MapPin } from "lucide-react";
import { useSnackbar } from "notistack";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";

type VineyardFormProps = {
  children?: React.ReactNode;
  onSave?: (data: Vineyard) => void;
  clicked?: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  onNameError?: (isError: boolean) => void;
};

export default function VineyardForm({
  onSave,
  clicked,
  setIsSubmitting,
  onNameError,
}: VineyardFormProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { vineyards = [] } = useVineyard();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardSchema),
  });

  const [formData, setFormData] = useState<Vineyard | null>();
  const [cadastral, setCadastral] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [identificatorUnicParcela, setIdentificatorUnicParcela] = useState("");

  const { resolveName, checkIfNameExists } = useVineyardNameExists();

  const handleNameChange = useCallback(
    (event: any) => {
      const nameIsValid = checkIfNameExists(event.target.value);

      if (nameIsValid) {
        setNameError("Vineyard name already exists");
        onNameError?.(true);
      } else {
        setNameError(null);
        onNameError?.(false);
      }

      setFormData((prevData: any) => {
        const path = ["name"];
        return setNestedValue(prevData, path, event.target.value);
      });
      setValue("name", event.target.value);
    },
    [checkIfNameExists]
  );

  const handlePolygonDrawingComplete = (data: Coordinates[]) => {
    const _path = "info.location.map";
    setValue(_path, data);
    setFormData((prevData: any) => {
      const path = _path.split(".");
      return setNestedValue(prevData, path, data);
    });
  };

  const handleArrayChange = (name: string, value: string) => {
    if (!value) return;

    const data: string[] =
      (formData?.[name as keyof Vineyard] as string[]) || [];
    data.push(value);
    setValue(name, data);
    setFormData((prevData) => {
      if (!prevData) {
        return null;
      }
      const result = {
        ...prevData,
        [name]: data,
      };

      return result;
    });
  };

  const handleDeleteFromArray = (name: string, value: any) => {
    const data: string[] =
      (formData?.[name as keyof Vineyard] as string[]) || [];
    const index = data.indexOf(value);
    if (index > -1) {
      data.splice(index, 1);
    }
    setValue(name, data);
    setFormData((prevData) => {
      if (!prevData) {
        return null;
      }
      const result = {
        ...prevData,
        [name]: data,
      };

      return result;
    });
  };

  const handleSelectChange = useCallback(
    (name: string, value: string | number) => {
      const _value = value;

      let _path: string = "";
      if (name && name !== undefined) {
        if (name.startsWith("info") || name.startsWith("grape")) {
          _path = name;
        } else {
          _path = `info.${name}`;
        }
      }

      setValue(_path as string, _value as typeof value);

      const path = _path.split(".");
      const newFormData = setNestedValue(formData, path, value);

      setFormData(() => newFormData);
    },
    [setValue]
  );

  const handleCheckboxChange = (name: string, value: boolean) => {
    const path = name;
    setValue(path, value);
    setFormData((prevData: any) => {
      const _path = path.split(".");
      return setNestedValue(prevData, _path, value);
    });
  };

  const handleCreateVineyard = useCallback(
    async (uid: string, data: any) => {

      if (formType === "create") {
        data.group = [data.name];
        data.status = VineyardStatus.MAINTENANCE;
      }

      data.createdAt = Timestamp.now();

      try {
        const getOneRes: DbResponse = await db.vineyard.getOne(uid, data.id);

        if (
          getOneRes.status === 200 &&
          getOneRes.data !== null &&
          getOneRes.data !== undefined
        ) {
          const {
            id,
            name,
            group = formData?.group,
            status = VineyardStatus.MAINTENANCE,
          } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
            status,
          };

          const updateRes: DbResponse = await db.vineyard.update(
            uid,
            id,
            newData
          );

          setFormData(() => newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });
            if (closeDrawer) closeDrawer();
          } else {
            enqueueSnackbar(`Error updating vineyard`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.vineyard.create(uid, data);

          setFormData(() => data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });
            if (closeDrawer) closeDrawer();
          } else {
            enqueueSnackbar(`Error creating vineyard`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
          "Error creating document or subcollection with data: ",
          e
        );
        enqueueSnackbar(`Error creating vineyard`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType]
  );

  const onSubmit = async (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await handleCreateVineyard(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const existingVineyard = vineyards?.find(({ id }) => id === selected[0]?.id);

  useEffect(() => {
    let name = `Vineyard ${vineyards?.length + 1}`;

    const check = async (n: string) => {
      const validName = resolveName(n);

      try {
        name = validName;
        if (formData) {
          formData.name = name;
        }
        setValue("name", name);
      } catch (err: any) {
      }
    };

    check(name);

    const formatted: Vineyard = {
      ...existingVineyard,
      cadastralNumber: existingVineyard?.cadastralNumber || [],
      name: existingVineyard?.name || name,
      ...(!existingVineyard && {
        id: crypto.randomUUID(),
        name,
        group: [name],
        labData: [],
        tasks: [],
        documents: [],
        notes: [],
        cadastralNumber: [],
        rowType: "item",
        identificatorUnicParcela: [],
      }),
      identificatorUnicParcela:
        existingVineyard?.identificatorUnicParcela || [],
    } as Vineyard;

    setFormData(formatted);
    reset(formatted);
  }, [existingVineyard, reset, vineyards?.length]);

  useEffect(() => {
    if (errors) {
    }
  }, [errors]);

  useEffect(() => {
    if (clicked && btnRef.current) {
      btnRef.current.click();
      onSave?.(formData || ({} as Vineyard));
    }
  }, [clicked, formData, onSave]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          className="pl-0 pr-0 w-full"
          style={{ background: "var(--mui-palette-background-default)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Box
              className="w-full"
              sx={{
                py: 2,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <div className="flex flex-col gap-4 w-full ">
                <Accordion
                  disableGutters={true}
                  defaultExpanded={true}
                  sx={{
                    background: isDarkMode
                      ? "#121212 !important"
                      : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">General</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col gap-4">
                      {}
                      <div className="hidden">
                        {}
                        <FormControl>
                          <Input
                            id={formData.id as Vineyard["id"]}
                            value={formData.id}
                            type="hidden"
                            {...register("id")}
                          />
                        </FormControl>
                      </div>
                      {}
                      <div className="flex flex-col gap-2">
                        {}
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter a name for the vineyard
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="name"
                            label="Vineyard Name"
                            type="text"
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: nameError
                                    ? "#ff3511aa"
                                    : "#inherit", // your custom color here
                                },
                                color: nameError ? "#f44336" : "#inherit",
                              },
                            }}
                            value={(formData?.name as string) || ""}
                            onChange={handleNameChange}
                          />
                        </FormControl>
                        {nameError && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {nameError}
                          </Typography>
                        )}
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
                      {}
                      <div className="flex flex-col gap-2">
                        {}
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter a grape variety for the vineyard
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="grapeVariety"
                            type="text"
                            label="Grape Variety"
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

                      {}
                      <div className="flex flex-col gap-2">
                        {}
                        <Typography
                          color="textSecondary"
                          className="text-sm text-muted-foreground"
                        >
                          Select the grape variety color
                        </Typography>

                        <FormControl>
                          <InputLabel
                            id="grapeColor"
                            className="text-sm text-muted-foreground"
                          >
                            Grape Color
                          </InputLabel>
                          <Select
                            label="Grape Color"
                            id="grapeColor"
                            value={(formData.grapeColor as string) || ""}
                            onChange={(e) => {
                              handleSelectChange("grapeColor", e.target.value);
                            }}
                            className="capitalize"
                          >
                            {Object.values(WineColor).map(
                              (grapeColor, index) => (
                                <MenuItem
                                  key={grapeColor + index}
                                  value={grapeColor}
                                  className="capitalize"
                                >
                                  {grapeColor}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                        {errors?.grapeColor && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.grapeColor?.message as string}
                          </Typography>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter the Identificatorul unic al parcelei viticole
                        </InputLabel>

                        <FormControl>
                          <Controller
                            name="identificatorUnicParcela"
                            control={control}
                            render={({ field }) => {
                              if (
                                field.value !== undefined &&
                                field.value.length > 0
                              ) {
                                return (
                                  <Stack
                                    direction={"row"}
                                    marginBottom={2}
                                    flexWrap={"wrap"}
                                    gap={1}
                                  >
                                    {field.value.map(
                                      (
                                        identificator: string,
                                        index: number
                                      ) => (
                                        <Chip
                                          key={identificator + index}
                                          label={identificator}
                                          onDelete={() => {
                                            handleDeleteFromArray(
                                              "identificatorUnicParcela",
                                              field.value[
                                                field.value.length - 1
                                              ]
                                            );
                                          }}
                                        />
                                      )
                                    )}
                                  </Stack>
                                );
                              } else {
                                return <></>;
                              }
                            }}
                          />
                          <Stack
                            spacing={2}
                            direction="column"
                            alignItems="center"
                            width="100%"
                          >
                            <Input
                              id="identificatorUnicParcela"
                              type="text"
                              label="Identificatorul unic al parcelei viticole"
                              variant="outlined"
                              fullWidth
                              value={identificatorUnicParcela}
                              onChange={(e) =>
                                setIdentificatorUnicParcela(e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outlined"
                              color="primary"
                              fullWidth
                              disabled={identificatorUnicParcela.length < 2}
                              onClick={() => {
                                handleArrayChange(
                                  "identificatorUnicParcela",
                                  identificatorUnicParcela
                                );
                                setIdentificatorUnicParcela("");
                              }}
                              startIcon={<Add />}
                            >
                              Add
                            </Button>
                          </Stack>
                        </FormControl>

                        {errors?.identificatorUnicParcela && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {
                              errors?.identificatorUnicParcela
                                ?.message as string
                            }
                          </Typography>
                        )}
                      </div>

                      {}
                      <div className="flex flex-col gap-2">
                        {}
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter the cadastral number(s)
                        </InputLabel>
                        <FormControl>
                          <Controller
                            name="cadastralNumber"
                            control={control}
                            render={({ field }) => {
                              if (
                                field.value !== undefined &&
                                field.value.length > 0
                              ) {
                                return (
                                  <Stack
                                    direction={"row"}
                                    marginBottom={2}
                                    flexWrap={"wrap"}
                                    gap={1}
                                  >
                                    {field.value.map(
                                      (cadastral: string, index: number) => (
                                        <Chip
                                          key={cadastral + index}
                                          label={cadastral}
                                          onDelete={() => {
                                            handleDeleteFromArray(
                                              "cadastralNumber",
                                              field.value[
                                                field.value.length - 1
                                              ]
                                            );
                                          }}
                                        />
                                      )
                                    )}
                                  </Stack>
                                );
                              } else {
                                return <></>;
                              }
                            }}
                          />
                          <Stack
                            spacing={2}
                            direction="column"
                            alignItems="center"
                            width={"100%"}
                          >
                            <Input
                              id="cadastralNumber"
                              type="text"
                              label="Cadastral Number"
                              variant="outlined"
                              fullWidth
                              value={cadastral}
                              onChange={(e) => setCadastral(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outlined"
                              color="primary"
                              fullWidth
                              disabled={cadastral.length < 2}
                              onClick={() => {
                                handleArrayChange("cadastralNumber", cadastral);
                                setCadastral("");
                              }}
                              startIcon={<Add />}
                            >
                              Add
                            </Button>
                          </Stack>
                        </FormControl>

                        {errors?.cadastralNumber && (
                          <Typography
                            variant="body2"
                            color="error"
                            className="mt-1"
                          >
                            {errors?.cadastralNumber?.message as string}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    background: isDarkMode
                      ? "#121212 !important"
                      : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography component="span">Vineyard Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="p-0 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground w-4 h-4" />
                        <h2 className="font-medium text-base">Location</h2>
                      </div>
                      <div className="flex flex-col gap-4">
                        {}

                        {}
                        <div className="w-full bg-muted rounded-md min-h-[320px] relative">
                          <PolygonDrawingMap
                            initialCoordinates={formData.info?.location?.map}
                            onComplete={handlePolygonDrawingComplete}
                          />
                        </div>

                        {}
                        <div className="flex flex-col gap-2">
                          <InputLabel className="text-sm text-muted-foreground">
                            Enter the surface area of the vineyard (Ha)
                          </InputLabel>

                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={2}
                            width={"100%"}
                            className="justify-between"
                          >
                            <FormControl className="w-full">
                              <Input
                                id="info.location.surface"
                                type="number"
                                variant="outlined"
                                label="Surface (Ha)"
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    step: 0.01,
                                    max: 100000,
                                  },
                                  inputLabel: {
                                    ...(formData?.info?.location?.surface && {
                                      shrink: true,
                                    }),
                                  },
                                }}
                                {...register("info.location.surface")}
                              />
                            </FormControl>
                          </Stack>

                          {(errors?.info as any)?.location?.surface && (
                            <p className="text-sm text-destructive  mt-1">
                              {
                                (errors?.info as any)?.location.surface
                                  .message as string
                              }
                            </p>
                          )}
                        </div>

                        {}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2 w-full">
                            <Typography
                              color="textSecondary"
                              className="text-sm text-muted-foreground"
                            >
                              Select the country of the vineyard
                            </Typography>
                            <Autocomplete
                              id="info.location.country"
                              options={countries.map(
                                (country) => country?.name
                              )}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select a country"
                                />
                              )}
                              value={
                                formData?.info?.location?.country as string
                              }
                              onChange={(e, value) => {
                                handleSelectChange(
                                  "info.location.country",
                                  value as string
                                );
                              }}
                            />
                            {(errors?.info as any)?.location?.country && (
                              <p className="text-sm text-destructive  mt-1">
                                {(errors?.info as any)?.location?.country}
                              </p>
                            )}
                          </div>
                        </div>

                        {}
                        <div className="flex flex-col gap-2">
                          <InputLabel className="text-sm text-muted-foreground">
                            Enter the City/Region of the vineyard
                          </InputLabel>
                          <FormControl>
                            <Input
                              id="info.location.city"
                              type="text"
                              variant="outlined"
                              label="City/Region"
                              {...register("info.location.city")}
                            />
                          </FormControl>
                          {(errors?.info as any)?.location?.city && (
                            <p className="text-sm text-destructive  mt-1">
                              {(errors?.info as any)?.location?.city}
                            </p>
                          )}
                        </div>

                        {}
                        <div className="flex flex-col gap-2 w-full">
                          <InputLabel className="text-sm text-muted-foreground">
                            Enter the elevation of the vineyard (m)
                          </InputLabel>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={2}
                            width={"100%"}
                            className="justify-between"
                          >
                            <FormControl className="w-full">
                              <Input
                                id="info.location.elevation"
                                type="number"
                                variant="outlined"
                                label="Elevation (m)"
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    step: 0.1,
                                  },
                                  inputLabel: {
                                    ...(formData?.info?.location?.elevation && {
                                      shrink: true,
                                    }),
                                  },
                                }}
                                {...register("info.location.elevation")}
                              />
                            </FormControl>
                          </Stack>
                          {(errors?.info as any)?.location?.elevation && (
                            <p className="text-sm text-destructive  mt-1">
                              {(errors?.info as any)?.location?.elevation}
                            </p>
                          )}
                        </div>

                        {}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2 w-full">
                            <Typography
                              color="textSecondary"
                              className="text-sm text-muted-foreground"
                            >
                              Select the exposure of the vineyard
                            </Typography>

                            <FormControl>
                              <InputLabel
                                id="orientation-select"
                                className="text-muted-foreground"
                              >
                                Select exposure
                              </InputLabel>
                              <Select
                                name="info.location.orientation"
                                labelId="orientation-select"
                                variant="outlined"
                                label="Select exposure"
                                value={
                                  formData?.info?.location
                                    ?.orientation as string
                                }
                                onChange={(e) =>
                                  handleSelectChange(
                                    "info.location.orientation",
                                    e.target.value
                                  )
                                }
                                className="capitalize"
                              >
                                {orientations.length > 0 &&
                                  orientations.map(
                                    (orientation: string, index: number) => {
                                      return (
                                        <MenuItem
                                          key={orientation + index}
                                          value={orientation}
                                          className="capitalize"
                                        >
                                          {orientation.split("-").join(" ")}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                              </Select>
                            </FormControl>
                            {(errors?.info as any)?.location?.orientation && (
                              <p className="text-sm text-destructive  mt-1">
                                {(errors?.info as any)?.location?.orientation}
                              </p>
                            )}
                          </div>
                        </div>

                        {}

                        {}

                        {}
                        <div className="flex items-center gap-2 mt-2">
                          <Leaf className="text-muted-foreground w-4 h-4" />
                          <Typography className="font-medium text-base">
                            Planting Scheme
                          </Typography>
                        </div>
                        {}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2 justify-between w-full">
                            <div className="flex flex-col gap-2">
                              <InputLabel className="text-sm text-muted-foreground">
                                Enter the spacing between rows (m)
                              </InputLabel>
                            </div>

                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              gap={2}
                              width={"100%"}
                              className="justify-between"
                            >
                              <FormControl className="w-full">
                                <Input
                                  className="w-full"
                                  id="info.vines.plantingScheme.spacing"
                                  type="number"
                                  variant="outlined"
                                  label="Spacing (m)"
                                  slotProps={{
                                    htmlInput: {
                                      min: 0,
                                      step: 0.1,
                                    },
                                    inputLabel: {
                                      ...(formData?.info?.vines?.plantingScheme
                                        ?.spacing && {
                                        shrink: true,
                                      }),
                                    },
                                  }}
                                  {...register(
                                    "info.vines.plantingScheme.spacing"
                                  )}
                                />
                              </FormControl>
                            </Stack>
                            {(errors?.info as any)?.vines?.plantingScheme
                              ?.spacing && (
                              <p className="text-sm text-destructive  mt-1">
                                {
                                  (errors?.info as any)?.vines?.plantingScheme
                                    ?.spacing
                                }
                              </p>
                            )}
                          </div>

                          {}

                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 w-full">
                              <Typography
                                color="textSecondary"
                                className="text-sm text-muted-foreground"
                              >
                                Select the row orientation
                              </Typography>

                              <FormControl>
                                <InputLabel id="row-orientation-select">
                                  Select orientation
                                </InputLabel>
                                <Select
                                  name="info.vines.plantingScheme.rowOrientation"
                                  id="info.vines.plantingScheme.rowOrientation"
                                  variant="outlined"
                                  label="Select orientation"
                                  value={
                                    formData?.info?.vines?.plantingScheme
                                      ?.rowOrientation as string
                                  }
                                  onChange={(e) =>
                                    handleSelectChange(
                                      "info.vines.plantingScheme.rowOrientation",
                                      e.target.value
                                    )
                                  }
                                  className="capitalize"
                                >
                                  {rowOrientations.length > 0 &&
                                    rowOrientations.map(
                                      (orientation: string, index: number) => {
                                        return (
                                          <MenuItem
                                            key={index + orientation}
                                            value={orientation}
                                            className="capitalize"
                                          >
                                            {orientation}
                                          </MenuItem>
                                        );
                                      }
                                    )}
                                </Select>
                              </FormControl>
                              {(errors?.info as any)?.location?.country && (
                                <p className="text-sm text-destructive  mt-1">
                                  {(errors?.info as any)?.location?.country}
                                </p>
                              )}
                            </div>
                          </div>

                          {}
                          <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                              <InputLabel className="text-sm text-muted-foreground">
                                Enter distance between vines on the same row (m)
                              </InputLabel>
                            </div>

                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              gap={2}
                              width={"100%"}
                              className="justify-between"
                            >
                              <FormControl className="w-full">
                                <Input
                                  id="info.vines.plantingScheme.density"
                                  type="number"
                                  variant="outlined"
                                  label="Distance (m)"
                                  slotProps={{
                                    htmlInput: {
                                      min: 0,
                                      step: 0.01,
                                      max: 100,
                                    },
                                    inputLabel: {
                                      ...(formData?.info?.vines?.plantingScheme
                                        ?.density && {
                                        shrink: true,
                                      }),
                                    },
                                  }}
                                  {...register(
                                    "info.vines.plantingScheme.density"
                                  )}
                                />
                              </FormControl>
                            </Stack>

                            {(errors?.info as any)?.vines?.plantingScheme
                              ?.density && (
                              <p className="text-sm text-destructive  mt-1">
                                {
                                  (errors?.info as any)?.vines?.plantingScheme
                                    ?.density
                                }
                              </p>
                            )}
                          </div>

                          {}
                          <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                              <InputLabel className="text-sm text-muted-foreground">
                                Enter the plants per Ha
                              </InputLabel>
                            </div>
                            <Input
                              id="info.vines.plantingScheme.plantsPerHa"
                              type="number"
                              variant="outlined"
                              label="Plants per Ha"
                              slotProps={{
                                htmlInput: {
                                  min: 0,
                                  step: 1,
                                  max: 100000,
                                },
                                inputLabel: {
                                  ...(formData?.info?.vines?.plantingScheme
                                    ?.plantsPerHa && {
                                    shrink: true,
                                  }),
                                },
                              }}
                              {...register(
                                "info.vines.plantingScheme.plantsPerHa"
                              )}
                            />
                            {(errors?.info as any)?.vines?.plantingScheme
                              ?.density && (
                              <p className="text-sm text-destructive  mt-1">
                                {
                                  (errors?.info as any)?.vines?.plantingScheme
                                    ?.density
                                }
                              </p>
                            )}
                          </div>

                          {}
                          <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                              <InputLabel className="text-sm text-muted-foreground">
                                Enter the vineyard trellis system
                              </InputLabel>
                            </div>
                            <Input
                              id="info.vines.plantingScheme.trellisSystem"
                              variant="outlined"
                              label="Trellis system type"
                              {...register(
                                "info.vines.plantingScheme.trellisSystem"
                              )}
                            />
                            {(errors?.info as any)?.vines?.plantingScheme
                              ?.trellisSystem && (
                              <p className="text-sm text-destructive  mt-1">
                                {
                                  (errors?.info as any)?.vines?.plantingScheme
                                    ?.trellisSystem
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        {}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2 w-full">
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Typography
                                color="textSecondary"
                                className="text-sm text-muted-foreground"
                              >
                                Select the year of plantation of the vineyard
                              </Typography>
                            </Stack>
                            <Autocomplete
                              id="info.vines.yearOfPlantation"
                              options={generateYearsList()}
                              value={
                                formData?.info?.vines?.yearOfPlantation || null
                              }
                              getOptionLabel={(option) => `${option}`}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Plantation year"
                                />
                              )}
                              onChange={(e, value) => {
                                if (!value) return;

                                handleSelectChange(
                                  "info.vines.yearOfPlantation",
                                  value
                                );
                              }}
                            />

                            {(errors?.info as any)?.vines?.yearOfPlantation && (
                              <p className="text-sm text-destructive  mt-1">
                                {(errors?.info as any)?.vines?.yearOfPlantation}
                              </p>
                            )}
                          </div>
                        </div>
                        {}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            {}
                            <span className="text-sm text-muted-foreground">
                              Enter the sunlight hours your vineyard receives.
                            </span>
                          </div>
                          <Input
                            id="info.vines.sunlightHours"
                            type="number"
                            variant="outlined"
                            label="Sunlight hours"
                            slotProps={{
                              htmlInput: { min: 0, step: 0.1, max: 3000 },
                              inputLabel: {
                                ...(formData?.info?.vines?.sunlightHours && {
                                  shrink: true,
                                }),
                              },
                            }}
                            {...register("info.vines.sunlightHours")}
                          />
                          {(errors?.info as any)?.vines?.plantingScheme
                            ?.rowOrientation && (
                            <p className="text-sm text-destructive  mt-1">
                              {
                                (errors?.info as any)?.vines?.plantingScheme
                                  ?.rowOrientation
                              }
                            </p>
                          )}
                        </div>

                        {}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2 w-full">
                            {}
                            <span className="text-sm text-muted-foreground">
                              Choose the soil type of your vineyard.
                            </span>
                            <FormControl>
                              <Input
                                id="info.vines.soilType"
                                variant="outlined"
                                label="Soil Type"
                                {...register("info.vines.soilType")}
                              />
                            </FormControl>

                            {(errors?.info as any)?.vines?.soilType && (
                              <p className="text-sm text-destructive  mt-1">
                                {(errors?.info as any)?.vines?.soilType}
                              </p>
                            )}
                          </div>
                        </div>

                        {}
                        {}
                        <div className="flex items-center gap-2 mt-2">
                          <ReceiptLong className="text-muted-foreground w-4 h-4" />
                          <Typography className="font-medium text-base">
                            Vineyard Classification / Dessignation
                          </Typography>
                        </div>

                        <div>
                          <div className="grid grid-cols-2">
                            {}
                            <div className="flex flex-col gap-2 justify-between">
                              <div className="flex flex-col gap-2">
                                {}
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="info.certifications.eco.active"
                                    checked={
                                      formData?.info?.certifications?.eco
                                        ?.active
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        "info.certifications.eco.active",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    ECO certified
                                  </span>
                                </div>
                              </div>
                            </div>

                            {}
                            <div className="flex flex-col gap-2 justify-between">
                              <div className="flex flex-col gap-2">
                                {}
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="info.certifications.bio"
                                    checked={
                                      formData?.info?.certifications?.bio
                                        ?.active
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        "info.certifications.bio.active",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    BIO certified
                                  </span>
                                </div>
                              </div>
                            </div>

                            {}
                            <div className="flex flex-col gap-2 justify-between">
                              <div className="flex flex-col gap-2">
                                {}
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="info.certifications.igp.active"
                                    checked={
                                      formData?.info?.certifications?.igp
                                        ?.active
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        "info.certifications.igp.active",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    IGP certified
                                  </span>
                                </div>
                              </div>
                            </div>

                            {}
                            <div className="flex flex-col gap-2 justify-between">
                              <div className="flex flex-col gap-2">
                                {}
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="info.certifications.dop.active"
                                    checked={
                                      formData?.info?.certifications?.dop
                                        ?.active
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        "info.certifications.dop.active",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    DOP certified
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {}
                          <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                              {}
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id="info.certifications.ice.active"
                                  checked={
                                    formData?.info?.certifications?.ice?.active
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "info.certifications.ice.active",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="text-sm text-muted-foreground">
                                  Designated for ice wine
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {}
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    background: isDarkMode
                      ? "#121212 !important"
                      : "#ffffff !important",
                    borderBottom:
                      "1px solid var(--mui-palette-divider) !important",
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                  >
                    <Typography component="span">Grape Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="p-4 flex flex-col gap-4">
                      {}
                      <div className="flex flex-col gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                          <Typography className="text-sm text-muted-foreground">
                            Enter the clonal selection of the grape
                          </Typography>
                        </div>
                        <Input
                          id="grape.clonalSelection"
                          type="text"
                          label="Clonal Selection"
                          {...register("grape.clonalSelection")}
                        />
                      </div>

                      {}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          <Typography
                            color="textSecondary"
                            className="text-sm text-muted-foreground"
                          >
                            Select the country of origin of the grape
                          </Typography>
                          <Autocomplete
                            id="grape.countryOfOrigin"
                            options={countries.map((country) => country.name)}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField {...params} label="Select a country" />
                            )}
                            value={formData?.grape?.countryOfOrigin || ""}
                            onChange={(e, value) => {
                              handleSelectChange(
                                "grape.countryOfOrigin",
                                value as string
                              );
                            }}
                          />
                          {(errors?.info as any)?.location?.country && (
                            <p className="text-sm text-destructive  mt-1">
                              {(errors?.info as any)?.location?.country}
                            </p>
                          )}
                        </div>
                      </div>

                      {}
                      <div className="flex flex-col gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-muted-foreground">
                            Enter the vivc number of the grape
                          </span>
                        </div>
                        <Input
                          id="grape.vivcNumber"
                          type="text"
                          label="Vivc Number"
                          {...register("grape.vivcNumber")}
                        />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </Box>

            {}
            <div className="hidden flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Enter the forecasted yield of your vineyard.
              </span>
              <input
                id="forecastedYield"
                type="number"
                {...register("forecastedYield")}
              />
            </div>
            <Box display={"flex"} justifyContent={"end"} visibility={"hidden"}>
              <FormControl>
                <Button ref={btnRef} type="submit" variant="contained">
                  Save
                </Button>
              </FormControl>
            </Box>
          </form>
        </div>
      )}
    </>
  );
}
