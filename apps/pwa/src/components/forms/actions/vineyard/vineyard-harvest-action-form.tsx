/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardHarvestActionSample } from "@/data/actions-samples";
import { useAuth } from "@/lib/firebase/auth";
import { vineyardHarvestActionSchema } from "@/models/schemas/actions/vineyard-harvest-action-schema";
import {
  ActionRelation,
  VineyardActions,
  VineyardHarvestAction,
} from "@/models/types/actions";
import { LabReport, Vessel, Vineyard } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";

import { useGetVineyardsNames } from "@/hooks/use-get-vineyards-names";
import { generateDummyDocs, generateLabData } from "@/utils/generators";
import { Attachment } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  TextField as Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setNestedValue } from "@/helpers/form-helpers";
import { useGrape } from "@/context/grape";

export type HarvestActionFormProps = {
  vineyards: Vineyard[];
  selectedVineyards?: Vineyard[];
  actions?: VineyardActions;
  vessels?: Vessel[];
  labReports?: LabReport[];
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const equipment: ActionRelation[] = [];

export default function VineyardHarvestActionForm({
  vineyards,
  actions,
  vessels,
  labReports,
  selectedVineyards,
}: HarvestActionFormProps) {
  const { user } = useAuth();
  const { grapes } = useGrape();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardHarvestActionSchema),
  });

  const { vineyardNames } = useGetVineyardsNames(vineyards);

  const [formData, setFormData] = useState<VineyardHarvestAction>(
    vineyardHarvestActionSample
  );

  const [disableSubject, setDisableSubject] = useState<boolean>(false);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
        console.log("DATE", value);
      }

      if (name === "subject.name") {
        //value = Timestamp.fromDate(value.toDate());
        setValue(
          "subject.id" as string,
          vineyards.filter((v) => v.name === value)[0]?.id as string
        );
        setValue("subject.name" as string, value as any);
      } else {
        setValue(name as string, value as any);
      }

      console.log("VALUE", name, value);

      const path = name.split(".");
      const newFormData = setNestedValue(formData, path, value);

      setFormData(newFormData);
    },
    [formData, setValue]
  );

  const handleMultipleSelectChange = useCallback(
    (event: SelectChangeEvent<typeof formData.vessels>) => {
      const {
        target: { value },
      } = event;

      const _vessels = vessels?.filter((v) => v.id === value[0]);
      // console.log("XXX", vessels, value);
      // console.log("SELECTED VESSELS", _vessels);

      setFormData({
        ...formData,
        vessels: _vessels as ActionRelation[],
      });
    },
    [formData, vessels]
  );

  const getStyles = (
    name: string,
    _name: readonly ActionRelation[],
    theme: Theme
  ) => {
    return {
      fontWeight: _name[0]?.name.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
      backgroundColor: _name[0]?.name.includes(name)
        ? theme.palette.primary.main
        : theme.palette.action.selected,
    };
  };

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(
      "SUBMIT",
      data,
      vineyards.filter((v) => v.id === data.subject.id)[0]
    );
    console.log("ERRORS:", errors);

    actions?.harvest.exec(
      user?.uid as string,
      data,
      vineyards.filter((v) => v.id === data.subject.id)[0]
    );

    setFormData(data);
  };

  useEffect(() => {
    vineyardHarvestActionSample.id = Date.now().toString();
    vineyardHarvestActionSample.type = "harvest";
    vineyardHarvestActionSample.executionDate = new Date().toDateString();
    vineyardHarvestActionSample.consumables = [];
    vineyardHarvestActionSample.batch = {
      id: `BatchID_${grapes?.length + 1}`,
      quantity: 0,
    };
    vineyardHarvestActionSample.invoiceNumber = `invoice-${Date.now().toString()}`;
    vineyardHarvestActionSample.equipment = [] as ActionRelation[];
    vineyardHarvestActionSample.description = "";
    vineyardHarvestActionSample.documents = generateDummyDocs(10);

    // * If there is only one vineyard selected, else use the first vineyard is any
    if (selectedVineyards && selectedVineyards.length === 1) {
      setDisableSubject(true);
      vineyardHarvestActionSample.subject = {
        id: selectedVineyards[0].id,
        name: selectedVineyards[0].name,
      };
      vineyardHarvestActionSample.supplier = selectedVineyards[0].name;
      vineyardHarvestActionSample.vessels = selectedVineyards[0]
        .vessels as ActionRelation[];
      vineyardHarvestActionSample.location =
        selectedVineyards[0].info.location.city;
    } else if (
      vineyards &&
      vineyards.length > 0 &&
      vessels &&
      vessels.length > 0
    ) {
      setDisableSubject(false);
      vineyardHarvestActionSample.subject = {
        id: vineyards[0].id,
        name: vineyards[0].name,
      };
      vineyardHarvestActionSample.supplier = vineyards[0].name;
      vineyardHarvestActionSample.vessels = vineyards[0]
        .vessels as ActionRelation[];
      vineyardHarvestActionSample.location = vineyards[0].info.location.city;
    }

    if (labReports && labReports.length > 0) {
      console.log("LAB REPORTS", labReports);
      vineyardHarvestActionSample.latestLabData = {
        date: (labReports[0].date as Timestamp).toDate().toDateString(),
        sugar: {
          value: labReports[0].results.sugar.value,
          unit: labReports[0].units[0] as string,
        },
        acidity: {
          value: labReports[0].results.acidity.value,
          unit: labReports[0].units[0] as string,
        },
      };
    } else {
      vineyardHarvestActionSample.latestLabData = {
        date: new Date().toDateString(),
        sugar: {
          value: 0,
          unit: "N/A",
        },
        acidity: {
          value: 0,
          unit: "N/A",
        },
      };
    }

    reset(vineyardHarvestActionSample);

    setFormData(vineyardHarvestActionSample);
  }, [vineyards, vessels, labReports, selectedVineyards]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          className="pl-4 w-full border-l"
          style={{ borderColor: "var(--mui-palette-divider)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="w-full">
              <div className="pl-4 flex flex-col gap-4 w-full">
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

                <div className="flex flex-col w-full">
                  {/* <DemoItem label="DatePicker"> */}
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    {/* * ACTION SUBJECT */}
                    <FormControl fullWidth>
                      <InputLabel id="subject-select">
                        Subject of the Action
                      </InputLabel>
                      <Select
                        disabled={disableSubject}
                        name="subject.name"
                        // labelId="subject-select"
                        id="subject-select"
                        value={(formData.subject.name as string) || ""}
                        label="Subject of the Action"
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
                      </Select>
                    </FormControl>
                    {/* * SUPPLIER */}
                    <div className="hidden">
                      <FormControl fullWidth>
                        <TextField
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                          type="text"
                          {...register("supplier")}
                          id="outlined-basic"
                          label="Supplier"
                          variant="outlined"
                        />
                      </FormControl>
                    </div>
                    {/* * EXECUTION DATE */}
                    <Stack gap={1} className="w-full">
                      <DatePicker
                        name="executionDate"
                        value={
                          formData.executionDate instanceof Timestamp
                            ? dayjs(formData.executionDate.toDate())
                            : dayjs(formData.executionDate)
                        }
                        label="Execution Date"
                        disablePast
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
                    {/* * CONSUMABLES */}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Consumables
                      </InputLabel>
                      <Select
                        disabled
                        name="consumables"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={"no-consumables"}
                        label="Consumables"
                        onChange={(e) => handleChange("consumables", e)}
                      >
                        <MenuItem value={"no-consumables"}>
                          No consumables
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {/* * BATCH */}
                    <div className="">
                      <FormControl fullWidth>
                        <TextField
                          id="outlined-basic"
                          label="Batch Name"
                          variant="outlined"
                          {...register("batch.id")}
                        />
                      </FormControl>
                    </div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="outlined-basic"
                        label="Quantity Kg"
                        variant="outlined"
                        inputProps={{
                          min: "0",
                          step: "0.01",
                        }}
                        {...register("batch.quantity")}
                      />
                    </FormControl>
                    {/* * LATEST LAB DATA */}
                    <Stack gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Latest Lab Data
                      </Typography>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Typography variant="body2" color="text.secondary">
                            Sugar
                          </Typography>
                          <TextField
                            disabled
                            type="number"
                            id="outlined-basic"
                            variant="outlined"
                            inputProps={{
                              min: "0",
                              step: "0.01",
                            }}
                            {...register("latestLabData.sugar.value")}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Typography variant="body2" color="text.secondary">
                            Acidity
                          </Typography>
                          <TextField
                            disabled
                            type="number"
                            id="outlined-basic"
                            variant="outlined"
                            inputProps={{
                              min: "0",
                              step: "0.01",
                            }}
                            {...register("latestLabData.acidity.value")}
                          />
                        </div>
                      </div>
                    </Stack>
                    {/* * VESSELS
                    <FormControl fullWidth>
                      <InputLabel id="vessels-select-label">Vessels</InputLabel>
                      {vessels &&
                        vessels !== undefined &&
                        vessels.length > 0 && (
                          <Select
                            labelId="vessels-select-label"
                            id="vessels-select"
                            multiple
                            value={formData.vessels || []}
                            onChange={handleMultipleSelectChange}
                            input={
                              <OutlinedInput
                                id="vessels-select"
                                label="Vessels"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => {
                                  return (
                                    <Chip key={value.id} label={value.name} />
                                  );
                                })}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {vessels.map((vessel) => (
                              <MenuItem
                                key={vessel.id}
                                value={vessel.id} // Use the vessel id as the value
                                style={getStyles(
                                  vessel.name,
                                  [
                                    formData?.vessels?.filter(
                                      (v: any) => v.name === vessel.name
                                    )[0] as any,
                                  ],
                                  theme
                                )}
                              >
                                {vessel.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                    </FormControl> */}
                    {/* * EQUIPMENT */}
                    <FormControl fullWidth>
                      <InputLabel id="equipment-select-label">
                        Equipment
                      </InputLabel>
                      {equipment &&
                      equipment !== undefined &&
                      equipment.length > 0 ? (
                        <Select
                          labelId="equipment-select-label"
                          id="equipment-select"
                          multiple
                          value={formData.equipment}
                          // onChange={handleMultipleSelectChange}
                          input={
                            <OutlinedInput
                              id="equipment-select"
                              label="Equipment"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => {
                                return (
                                  <Chip key={value.id} label={value.name} />
                                );
                              })}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {equipment.map((vessel) => (
                            <MenuItem
                              key={vessel.id}
                              value={vessel.id} // Use the vessel id as the value
                              style={getStyles(
                                vessel.name,
                                [
                                  formData.vessels.filter(
                                    (v: any) => v.name === vessel.name
                                  )[0] as any,
                                ],
                                theme
                              )}
                            >
                              {vessel.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Select
                          labelId="equipment-select-label"
                          id="equipment-select"
                          multiple
                          disabled
                          value={formData.equipment}
                          onChange={handleMultipleSelectChange}
                          input={
                            <OutlinedInput
                              id="equipment-select"
                              label="Equipment"
                            />
                          }
                          MenuProps={MenuProps}
                        ></Select>
                      )}
                    </FormControl>
                    {/* * DESCRIPTION */}
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        id="description"
                        label="Description"
                        variant="outlined"
                        {...register("description")}
                      />
                    </FormControl>
                    {/* * LOCATION */}
                    <div className="hidden">
                      <FormControl fullWidth>
                        <TextField
                          type="text"
                          id="location"
                          label="Location"
                          variant="outlined"
                          {...register("location")}
                        />
                      </FormControl>
                    </div>

                    <Stack gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Documents
                      </Typography>
                      <Stack
                        gap={1}
                        padding={2}
                        sx={{
                          border: "2px",
                          borderColor: "var(--mui-palette-divider)",
                          borderStyle: "solid",
                          borderRadius: "8px",
                        }}
                      >
                        {formData.documents &&
                          formData.documents.length > 0 &&
                          formData.documents
                            .filter((item) => parseInt(item.id) <= 1)
                            .map((item) => (
                              <div key={`${item.id}-${item.name}`}>
                                <div className="flex items-center gap-2">
                                  <Attachment
                                    fontSize="small"
                                    color="primary"
                                  />
                                  <Typography variant="body2">{`${item.name}-${new Date(item.uploadDate).toLocaleDateString()}.doc`}</Typography>
                                </div>
                              </div>
                            ))}
                      </Stack>
                    </Stack>
                  </Box>
                </div>
              </div>
            </div>

            <Box display={"flex"} justifyContent={"end"}>
              <FormControl>
                <Button type="submit" variant="contained" className="mt-8">
                  Execute
                </Button>
              </FormControl>
            </Box>
          </form>
        </div>
      )}
    </>
  );
}
