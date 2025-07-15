/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardGlobalActionSample } from "@/data/actions-samples";
import { ActionRelation, VineyardGlobalAction } from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useConsumable } from "@/context/consumable";
import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { useGetVineyardsNames } from "@/hooks/use-get-vineyards-names";
import { vineyardGlobalActionSchema } from "@/models/schemas/actions/vineyard-global-action-schema";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  TextField as Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextareaAutosize,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileUploaderField from "../../custom-fields/file-uploader-field";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";
import { useAuth } from "@/lib/firebase/auth";

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
// const consumables: ActionRelation[] = [];

export default function VineyardWeedRemovalActionForm({
  onBackClick,
}: {
  onBackClick?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { vineyards = [], actions } = useVineyard();
  const { user } = useAuth();
  const { consumables } = useConsumable();
  const { teamMembers } = useWinery();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardGlobalActionSchema),
  });
  const { vineyardNames } = useGetVineyardsNames(vineyards);
  const [formData, setFormData] = useState<VineyardGlobalAction>(
    vineyardGlobalActionSample
  );

  const handleChange = useCallback(
    (name: string, value: any) => {
      // console.log("NAME", name, value);
      if (name.startsWith("consumables")) {
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
          ...(prev as VineyardGlobalAction),
          consumables: _consumables,
        }));

        setValue("consumables", _consumables);

        return;
      }
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        [name]: value,
      }));
    },
    [consumables, formData]
  );

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
          ...(prev as VineyardGlobalAction),
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
          ...(prev as VineyardGlobalAction),
          consumables: data,
        }));
      }
    },
    [formData]
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

  const handleMultipleSelectChange = useCallback(
    (event: SelectChangeEvent<typeof formData.equipment>, name: string) => {
      const {
        target: { value },
      } = event;

      if (value !== undefined && value.length > 0) {
        const data = equipment?.filter((v) => v.id === value[0]);
        setFormData({
          ...formData,
          [name]: data as ActionRelation[],
        });
      }
    },
    [formData, equipment]
  );

  const onSubmit = async (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectVineyard = vineyards.filter(
      (v) => v.id === data.inUseVineyard.id
    )[0];

    setIsSubmitting(true);

    try {
      await actions?.["weed-removal"].exec(
        user?.uid as string,
        data,
        subjectVineyard
      );
    } finally {
      setIsSubmitting(false);
    }

    setFormData(data);

    onBackClick?.();
  };

  useEffect(() => {
    if (
      vineyards &&
      vineyards.length > 0 &&
      consumables &&
      consumables.length > 0
    ) {
      vineyardGlobalActionSample.id = Date.now().toString();
      vineyardGlobalActionSample.type = "irrigation";
      vineyardGlobalActionSample.executionDate = new Date().toDateString();
      vineyardGlobalActionSample.inUseVineyard = {
        id: vineyards[0].id,
        name: vineyards[0].name,
      };

      if (
        vineyardGlobalActionSample.equipment &&
        vineyardGlobalActionSample.equipment.length > 0
      ) {
        vineyardGlobalActionSample.equipment = [];
      }

      reset(vineyardGlobalActionSample);
      setFormData(vineyardGlobalActionSample);
    }
  }, [vineyards, consumables]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

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
                      id={formData.id as VineyardGlobalAction["id"]}
                      value={formData.id}
                      type="hidden"
                      {...register("id")}
                    />
                  </FormControl>
                </div>

                <div className="flex flex-col w-full">
                  {/* <DemoItem label="DatePicker"> */}
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    {/* * In use Vineyard */}
                    <FormControl fullWidth>
                      <InputLabel id="subject-select">
                        Selected Vineyard
                      </InputLabel>
                      <Select
                        name="inUseVineyard.name"
                        // labelId="subject-select"
                        id="inUseVineyard.name"
                        value={(formData.inUseVineyard.name as string) || ""}
                        label="Selected Vineyard"
                        onChange={(e) => {
                          handleChange("inUseVineyard.name", e.target.value);
                          handleChange(
                            "inUseVineyard.id",
                            vineyards.filter(
                              (v) => v.name === e.target.value
                            )[0].id
                          );
                        }}
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
                    {/* ! CONSUMABLES */}
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
                                  {errors?.vessels &&
                                    Array.isArray(errors?.vessels) &&
                                    (errors?.vessels[index]?.qty
                                      ?.message as string)}
                                </Typography>
                              </Fragment>
                            )
                          )}
                        </Stack>
                      )}

                      {errors?.vessels && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.vessels?.message as string}
                        </Typography>
                      )}
                    </div>

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
                          {equipment.map((equ) => (
                            <MenuItem
                              key={equ.id}
                              value={equ.id} // Use the vessel id as the value
                              style={getStyles(
                                equ.name,
                                [
                                  formData?.equipment?.filter(
                                    (v: any) => v.name === equ.name
                                  )[0] as any,
                                ],
                                theme
                              )}
                            >
                              {equ.name}
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
                          onChange={(e) =>
                            handleMultipleSelectChange(e, "equipment")
                          }
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

                    <FileUploaderField
                      data={formData.supportingDocuments}
                      path="supportingDocuments"
                    />

                    <div className="flex flex-col gap-2">
                      <Typography variant="body2" color="textSecondary">
                        Description
                      </Typography>
                      <FormControl>
                        <TextareaAutosize
                          {...register("aditionalInformation")}
                          minRows={8}
                          placeholder="Provide additional information"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "var(--mui-palette-divider)",
                            borderRadius: "4px",
                            padding: "16px 8px",
                          }}
                        />
                      </FormControl>
                    </div>
                  </Box>
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
      )}
    </>
  );
}
