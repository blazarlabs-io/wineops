/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PolygonDrawingMap from "@/components/widgets/maps/polygon-drawing-map";
import { useVineyard } from "@/context/vineyard";
import { countries } from "@/data/countries";
import { orientations, soilTypes } from "@/data/system-variables";
import vineyardBlankSample from "@/data/vineyard-blank-sample";
import { setNestedValue } from "@/helpers/form-helpers";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { vineyardSchema } from "@/models/schemas/vineyard-schema";
import {
  Coordinates,
  DbResponse,
  LabDataSimple,
  Vineyard,
} from "@/models/types/db";
import {
  generateDummyDocs,
  generateLabData,
  generateNotes,
  generateTasks,
  generateYearsList,
} from "@/utils/generators";
import { joiResolver } from "@hookform/resolvers/joi";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  TextField as Input,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Leaf, MapPin } from "lucide-react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";

export type VineyardFormProps = {
  children?: React.ReactNode;
  vineyard: Vineyard | null;
  closeDrawer?: () => void;
  type?: "create" | "edit";
};

export default function VineyardForm({
  vineyard,
  closeDrawer,
  type = "create",
}: VineyardFormProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { vineyards } = useVineyard();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardSchema),
  });

  const [formData, setFormData] = useState<Vineyard | null>(vineyard);

  const handlePolygonDrawingComplete = (data: Coordinates[]) => {
    const _path = "info.location.map";
    setValue(_path, data);
    setFormData((prevData: any) => {
      const path = _path.split(".");
      return setNestedValue(prevData, path, data);
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

      console.log("XXXXXXXXXXXXXXXXXXXXX");
      console.log(_path, value as typeof value);

      setValue(_path as string, _value as typeof value);

      const path = _path.split(".");
      const newFormData = setNestedValue(formData, path, value);

      setFormData(() => newFormData);
    },
    [formData, setValue]
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
      if (type === "create") data.group = [data.name];

      try {
        // * Check if vineyard already exists
        const getOneRes: DbResponse = await db.vineyard.getOne(uid, data.id);
        if (
          getOneRes.status === 200 &&
          (getOneRes.data === null || getOneRes.data !== undefined)
        ) {
          const { id, name, group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
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
        console.error(
          "Error creating document or subcollection with data: ",
          e
        );
        enqueueSnackbar(`Error creating vineyard`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, type]
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("[VINEYARD FORM SUBMIT]", data);
    handleCreateVineyard(user?.uid || "", data);
  };

  useEffect(() => {
    console.log("[VINEYARD FORM]", vineyard);
    if (vineyard) {
      if (vineyard.name.length > 0) {
        console.log("EXISTING VINEYARD", vineyard);
        reset(vineyard);
        setFormData(vineyard);
      } else {
        console.log("NEW VINEYARD", vineyard);
        setValue("name", `Vineyard ${vineyards?.length + 1}`);
        setFormData(vineyard);
        reset(vineyard);
      }
    }
  }, [vineyard]);

  useEffect(() => {
    if (errors) {
      console.log("[VINEYARD FORM ERRORS]", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          className="px-4"
          style={{ background: "var(--mui-palette-background-default)" }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 space-x-4"
          >
            <div>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span">General</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="p-4 flex flex-col gap-4 border-l">
                    {/* * ID - HIDDEN */}
                    <div className="hidden">
                      {/* <Label htmlFor="id">Id</Label> */}
                      <FormControl>
                        <Input
                          id={formData.id as Vineyard["id"]}
                          value={formData.id}
                          type="hidden"
                          {...register("id")}
                        />
                      </FormControl>
                    </div>
                    {/* * VINEYARD NAME */}
                    <div className="flex flex-col gap-2">
                      {/* <Label htmlFor="name">Vineyard Name</Label> */}
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter a reference name for your vineyard.
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="name"
                          label="Name"
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
                    {/* * GRAPE VARIETY - MANDATORY */}
                    <div className="flex flex-col gap-2">
                      {/* <Label htmlFor="grapeVariety">Grape Variety</Label> */}
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter the grape variety of your vineyard.
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

                    {/* * GRAPE COLOR - MANDATORY */}
                    <div className="flex flex-col gap-2">
                      {/* <Label htmlFor="grapeColor">Grape Color</Label> */}
                      <InputLabel className="text-sm text-muted-foreground">
                        Your grape&apos;s color
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="grapeColor"
                          type="text"
                          label="Grape's Color"
                          variant="outlined"
                          {...register("grapeColor")}
                        />
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

                    {/* * CADASTRAL NUMBER */}
                    <div className="flex flex-col gap-2">
                      {/* <Label htmlFor="cadastralNumber">Cadastral Number</Label> */}
                      <InputLabel className="text-sm text-muted-foreground">
                        Enter the cadastral number of your vineyard.
                      </InputLabel>
                      <FormControl>
                        <Input
                          id="cadastralNumber"
                          type="text"
                          label="Cadastral Reference"
                          variant="outlined"
                          {...register("cadastralNumber")}
                        />
                      </FormControl>

                      {errors?.cadastralNumber && (
                        <p className="text-sm text-destructive  mt-1">
                          {errors?.cadastralNumber?.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span">Vineyard Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground w-4 h-4" />
                      <h2 className="font-medium text-base">Location</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* ? LOCATION */}

                      {/* * MAP */}
                      <p className="text-sm font-semibold">Map</p>
                      <div className="w-full bg-muted rounded-md min-h-[320px] relative">
                        <PolygonDrawingMap
                          initialCoordinates={formData.info.location.map}
                          onComplete={handlePolygonDrawingComplete}
                        />
                      </div>

                      {/* * SURFACE */}
                      <div className="flex flex-col gap-2">
                        {/* <Label htmlFor="info.location.surface">Surface Area</Label> */}
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter the surface area of your vineyard.
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="info.location.surface"
                            type="number"
                            variant="outlined"
                            label="Surface Area"
                            inputProps={{
                              step: "any",
                            }}
                            {...register("info.location.surface")}
                            fullWidth
                          />
                        </FormControl>
                        {/* {errors?.info?.location?.surface && (
                          <p className="text-sm text-destructive  mt-1">
                            {errors?.info.location.surface.message as string}
                          </p>
                        )} */}
                      </div>

                      {/* * COUNTRY */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          <InputLabel className="text-sm text-muted-foreground">
                            Choose the country of your vineyard.
                          </InputLabel>
                          <FormControl>
                            <Select
                              name="info.location.country"
                              id="info.location.country"
                              variant="outlined"
                              value={
                                formData?.info?.location?.country as string
                              }
                              onChange={(e) =>
                                handleSelectChange(
                                  "info.location.country",
                                  e.target.value
                                )
                              }
                            >
                              {/* <MenuItem value="select-country">
                                <em>Select Country</em>
                              </MenuItem> */}
                              {countries.length > 0 &&
                                countries.map(
                                  (country: { name: string; code: string }) => {
                                    return (
                                      <MenuItem
                                        key={country.name}
                                        value={country.name
                                          .toLocaleLowerCase()
                                          .split(" ")
                                          .join("-")}
                                      >
                                        {country.name}
                                      </MenuItem>
                                    );
                                  }
                                )}
                            </Select>
                          </FormControl>

                          {/* {errors?.info?.location?.country && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.location?.country}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {/* * CITY */}
                      <div className="flex flex-col gap-2">
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter the city of your vineyard.
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="info.location.city"
                            type="text"
                            variant="outlined"
                            label="City"
                            {...register("info.location.city")}
                          />
                        </FormControl>
                        {/* {errors?.info?.location?.city && (
                          <p className="text-sm text-destructive  mt-1">
                            {errors?.info?.location?.city}
                          </p>
                        )} */}
                      </div>

                      {/* * ELEVATION */}
                      <div className="flex flex-col gap-2">
                        {/* <Label htmlFor="info.location.elevation">Elevation</Label> */}
                        <InputLabel className="text-sm text-muted-foreground">
                          Enter the elevation of your vineyard.
                        </InputLabel>
                        <FormControl>
                          <Input
                            id="info.location.elevation"
                            type="number"
                            variant="outlined"
                            label="Surface Area"
                            inputProps={{
                              step: "any",
                            }}
                            {...register("info.location.elevation")}
                          />
                        </FormControl>
                        {/* {errors?.info?.location?.elevation && (
                          <p className="text-sm text-destructive  mt-1">
                            {errors?.info?.location?.elevation}
                          </p>
                        )} */}
                      </div>

                      {/* * ORIENTATION */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          {/* <Label htmlFor="info.location.orientation">Orientation</Label> */}
                          <InputLabel className="text-sm text-muted-foreground">
                            Select the orientation of your vineyard.
                          </InputLabel>

                          <FormControl>
                            <Select
                              name="info.location.orientation"
                              id="info.location.orientation"
                              variant="outlined"
                              value={
                                formData?.info?.location?.orientation as string
                              }
                              onChange={(e) =>
                                handleSelectChange(
                                  "info.location.orientation",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="select-orientation">
                                <em>Select Orientation</em>
                              </MenuItem>
                              {orientations.length > 0 &&
                                orientations.map((orientation: string) => {
                                  return (
                                    <MenuItem
                                      key={orientation}
                                      value={orientation}
                                    >
                                      {orientation}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          {/* {errors?.info?.location?.country && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.location?.country}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {/* ? END OF LOCATION */}

                      {/* ? VINES */}

                      {/* * PLANTING SCHEME */}
                      <div className="flex items-center gap-2 mt-2">
                        <Leaf className="text-muted-foreground w-4 h-4" />
                        <Typography className="font-medium text-base">
                          Planting Scheme
                        </Typography>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* * SPACING */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            {/* <Label htmlFor="info.vines.plantingScheme.spacing">Spacing</Label> */}
                            <InputLabel className="text-sm text-muted-foreground">
                              Enter the spacing in meters for the planting
                              scheme of your vineyard.
                            </InputLabel>
                          </div>
                          <FormControl>
                            <Input
                              id="info.vines.plantingScheme.spacing"
                              type="number"
                              variant="outlined"
                              label="Spacing"
                              inputProps={{
                                step: "any",
                              }}
                              // step={"any"}
                              {...register("info.vines.plantingScheme.spacing")}
                            />
                          </FormControl>
                          {/* {errors?.info?.vines?.plantingScheme?.spacing && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.plantingScheme?.spacing}
                            </p>
                          )} */}
                        </div>

                        {/* * ROW ORIENTATION */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            <InputLabel className="text-sm text-muted-foreground">
                              Enter the row orientation of the planting scheme
                              of your vineyard.
                            </InputLabel>
                          </div>
                          <FormControl>
                            <Input
                              id="info.vines.plantingScheme.rowOrientation"
                              type="text"
                              variant="outlined"
                              label="Row orientation"
                              {...register(
                                "info.vines.plantingScheme.rowOrientation"
                              )}
                            />
                          </FormControl>
                          {/* {errors?.info?.vines?.plantingScheme?.rowOrientation && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.plantingScheme?.rowOrientation}
                            </p>
                          )} */}
                        </div>

                        {/* * DENSITY */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            <InputLabel className="text-sm text-muted-foreground">
                              Enter the density of the planting scheme of your
                              vineyard.
                            </InputLabel>
                          </div>
                          <Input
                            id="info.vines.plantingScheme.density"
                            type="number"
                            variant="outlined"
                            label="Density"
                            inputProps={{
                              step: "any",
                            }}
                            {...register("info.vines.plantingScheme.density")}
                          />
                          {/* {errors?.info?.vines?.plantingScheme?.density && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.plantingScheme?.density}
                            </p>
                          )} */}
                        </div>

                        {/* * TRELLIS SYSTEM  */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  id="info.vines.plantingScheme.trellisSystem"
                                  checked={
                                    formData.info.vines.plantingScheme
                                      .trellisSystem
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "info.vines.plantingScheme.trellisSystem",
                                      e.target.checked
                                    )
                                  }
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground">
                                Does your vineyard have a trellis system?
                              </span>
                            </div>
                          </div>

                          {/* {errors?.info?.vines?.plantingScheme?.trellisSystem && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.plantingScheme?.trellisSystem}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {/* * YEAR OF PLANTATION */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          {/* <Label htmlFor="info.vines.yearOfPlantation">Year of plantation</Label> */}
                          <span className="text-sm text-muted-foreground">
                            Enter the year of plantation of your vineyard.
                          </span>

                          <FormControl>
                            <Select
                              name="info.vines.yearOfPlantation"
                              id="info.vines.yearOfPlantation"
                              variant="outlined"
                              value={formData?.info?.vines?.yearOfPlantation}
                              onChange={(e) =>
                                handleSelectChange(
                                  "info.vines.yearOfPlantation",
                                  e.target.value
                                )
                              }
                            >
                              {/* <MenuItem value="select-country">
                                <em>Select Country</em>
                              </MenuItem> */}
                              {generateYearsList().map(
                                (year: number, index: number) => {
                                  return (
                                    <MenuItem
                                      key={year + Math.random() * index}
                                      value={year}
                                    >
                                      {year}
                                    </MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          </FormControl>

                          {/* {errors?.info?.vines?.yearOfPlantation && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.yearOfPlantation}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {/* * SUNLIGHT HOURS */}
                      <div className="flex flex-col gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                          {/* <Label htmlFor="info.vines.sunlightHours">Sunlight hours</Label> */}
                          <span className="text-sm text-muted-foreground">
                            Enter the sunlight hours your vineyard receives.
                          </span>
                        </div>
                        <Input
                          id="info.vines.sunlightHours"
                          type="number"
                          variant="outlined"
                          label="Sunlight hours"
                          inputProps={{
                            step: "any",
                          }}
                          {...register("info.vines.sunlightHours")}
                        />
                        {/* {errors?.info?.vines?.plantingScheme?.rowOrientation && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.plantingScheme?.rowOrientation}
                            </p>
                          )} */}
                      </div>

                      {/* * SOIL TYPE */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          {/* <Label htmlFor="info.vines.soilType">Soil Type</Label> */}
                          <span className="text-sm text-muted-foreground">
                            Choose the soil type of your vineyard.
                          </span>
                          <FormControl>
                            <Select
                              id="info.vines.soilType"
                              value={formData?.info?.vines?.soilType}
                              label="Soil Type"
                              variant="outlined"
                              onChange={(e) =>
                                handleSelectChange(
                                  "info.vines.soilType",
                                  e.target.value
                                )
                              }
                            >
                              {soilTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* {errors?.info?.vines?.soilType && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.vines?.soilType}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {/* ? END OF VINES */}
                      {/* ? CERTIFICATIONS */}
                      <div className="flex items-center gap-2 mt-2">
                        <Leaf className="text-muted-foreground w-4 h-4" />
                        <Typography className="font-medium text-base">
                          Certifications
                        </Typography>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* * ECO/BIO */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            {/* <Label htmlFor="info.certifications.eco.active">Eco/Bio</Label> */}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="info.certifications.eco.active"
                                checked={
                                  formData?.info?.certifications?.eco?.active
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "info.certifications.eco.active",
                                    e.target.checked
                                  )
                                }
                                // {...register("info.certifications.eco.active")}
                              />
                              <span className="text-sm text-muted-foreground">
                                Is your vineyard certified Eco/Bio?
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* * IGP */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            {/* <Label htmlFor="info.certifications.igp.active">IGP</Label> */}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="info.certifications.igp.active"
                                checked={
                                  formData?.info?.certifications?.igp?.active
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "info.certifications.igp.active",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                Is your vineyard certified IGP?
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* * DOP */}
                        <div className="flex flex-col gap-2 justify-between">
                          <div className="flex flex-col gap-2">
                            {/* <Label htmlFor="info.certifications.dop.active">DOP</Label> */}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="info.certifications.dop.active"
                                checked={
                                  formData?.info?.certifications?.dop?.active
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "info.certifications.dop.active",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                Is your vineyard certified DOP?
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ? END OF CERTIFICATIONS */}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography component="span">GrapeDetails</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="p-4 flex flex-col gap-4 border-l ">
                    <div className="flex flex-col gap-2 justify-between">
                      <div className="flex flex-col gap-2">
                        {/* <Label htmlFor="grape.clonalSelection">Clonal Selection</Label> */}
                        <span className="text-sm text-muted-foreground">
                          Enter the clonal selection of your vineyard.
                        </span>
                      </div>
                      <Input
                        id="grape.clonalSelection"
                        type="text"
                        {...register("grape.clonalSelection")}
                      />
                    </div>

                    {/* * VIVC NUMBER */}

                    <div className="flex flex-col gap-2 justify-between">
                      <div className="flex flex-col gap-2">
                        {/* <Label htmlFor="grape.vivcNumber">Vivc Number</Label> */}
                        <span className="text-sm text-muted-foreground">
                          Enter the vivc number of your vineyard.
                        </span>
                      </div>
                      <Input
                        id="grape.vivcNumber"
                        type="text"
                        {...register("grape.vivcNumber")}
                      />
                    </div>

                    {/* * COUNTRY OF ORIGIN */}

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2 w-full">
                        {/* <Label htmlFor="grape.countryOfOrigin">Country of Origin</Label> */}
                        <span className="text-sm text-muted-foreground">
                          Enter the country of origin of your grape.
                        </span>
                        <FormControl>
                          <Select
                            name="grape.countryOfOrigin"
                            id="grape.countryOfOrigin"
                            variant="outlined"
                            value={formData?.grape?.countryOfOrigin as string}
                            onChange={(e) =>
                              handleSelectChange(
                                "grape.countryOfOrigin",
                                e.target.value
                              )
                            }
                          >
                            {countries.length > 0 &&
                              countries.map(
                                (country: { name: string; code: string }) => {
                                  return (
                                    <MenuItem
                                      key={country.name}
                                      value={country.name
                                        .toLocaleLowerCase()
                                        .split(" ")
                                        .join("-")}
                                    >
                                      {country.name}
                                    </MenuItem>
                                  );
                                }
                              )}
                          </Select>
                        </FormControl>

                        {/* <FormControl>
                          <Select
                            name="grape.countryOfOrigin"
                            id="grape.countryOfOrigin"
                            variant="outlined"
                            value={formData?.grape?.countryOfOrigin}
                            onChange={handleSelectChange}
                          >
                            {countries.map(
                              (country: { name: string; code: string }) => {
                                return (
                                  <MenuItem
                                    key={country.code}
                                    value={country.name}
                                  >
                                    {country.name}
                                  </MenuItem>
                                );
                              }
                            )}
                          </Select>
                        </FormControl> */}

                        {/* {errors?.info?.location?.country && (
                            <p className="text-sm text-destructive  mt-1">
                              {errors?.info?.location?.country}
                            </p>
                          )} */}
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* * FORECASTED YIELD - HIDDEN */}
            <div className="hidden flex-col gap-2">
              {/* <Label htmlFor="forecastedYield">Yield/Forecast</Label> */}
              <span className="text-sm text-muted-foreground">
                Enter the forecasted yield of your vineyard.
              </span>
              <input
                id="forecastedYield"
                type="number"
                {...register("forecastedYield")}
              />
              {/* {errors?.forecastedYield && (
                  <p className="text-sm text-destructive  mt-1">{errors?.forecastedYield}</p>
                )} */}
            </div>

            <Box display={"flex"} justifyContent={"end"} gap={2} px={2}>
              <FormControl>
                <Button type="submit" variant="contained" className="mt-8">
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
