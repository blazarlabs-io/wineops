"use client";

import { useConsumable } from "@/context/consumable";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { consumableSchema } from "@/models/schemas/consumable-schema";
import {
  DbResponse,
  FormMode,
  Consumable,
  ConsumableCategory,
} from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { parseToDate } from "@/utils/date-format";
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
  FormControlLabel,
  TextField as Input,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ConsumableForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { consumables } = useConsumable();
  const existingConsumable = consumables?.find(
    ({ id }) => id === selected[0]?.id,
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<Consumable>({
    resolver: joiResolver(consumableSchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Consumable | undefined>();

  const handleSelectChange = useCallback(
    (name: keyof Consumable, value: Consumable[keyof Consumable]) => {
      setValue(name as keyof Consumable, value);
      setFormData((prev) => ({ ...(prev as Consumable), [name]: value }));
    },
    [setValue],
  );

  const handleCreateConsumable = useCallback(
    async (uid: string, data: Consumable) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";
      }

      try {
        const getOneRes: DbResponse = await db.consumable.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
          };

          const updateRes: DbResponse = await db.consumable.update(
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
            enqueueSnackbar(`Error updating consumable`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.consumable.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating consumable`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e,
        );

        enqueueSnackbar(`Error creating consumable`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType],
  );

  const onSubmit = async (data: Consumable) => {
    setIsSubmitting(true);

    try {
      await handleCreateConsumable(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const consumableID = `Consumable_${consumables?.filter(({ rowType }) => rowType !== "group")?.length + 1}`;

    const formatted = {
      ...existingConsumable,
      ...(!existingConsumable && {
        id: Date.now().toString(),
        consumableID,
      }),
    } as Consumable;

    reset(formatted);
    setFormData(formatted);
  }, [reset, existingConsumable, consumables]);

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
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
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
                        id={formData?.id as Consumable["id"]}
                        value={formData?.id || ""}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select category:
                    </InputLabel>

                    <FormControl>
                      <Select
                        name="category"
                        id="category"
                        variant="outlined"
                        value={formData?.category ?? ""}
                        onChange={(e) =>
                          handleSelectChange("category", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>

                        {Object.values(ConsumableCategory).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {errors?.category && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.category?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter name:
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

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter reference ID:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="consumableID"
                        label="Consumable ID"
                        type="text"
                        variant="outlined"
                        {...register("consumableID")}
                      />
                    </FormControl>

                    {errors?.consumableID && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.consumableID?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter quantity
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="qty"
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        {...register("qty")}
                      />
                    </FormControl>

                    {errors?.qty && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.qty?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter minimum stock alert
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="minimumStockAlert"
                        label="Minimum stock alert"
                        type="number"
                        variant="outlined"
                        {...register("minimumStockAlert")}
                      />
                    </FormControl>

                    {errors?.minimumStockAlert && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.minimumStockAlert?.message as string}
                      </Typography>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="general-info-content"
                id="general-info-header"
              >
                <Typography component="span">General Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="p-4 flex flex-col gap-4 border-l">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter manufacturer:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="manufacturer"
                        label="Manufacturer"
                        type="text"
                        variant="outlined"
                        {...register("manufacturer")}
                      />
                    </FormControl>

                    {errors?.manufacturer && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.manufacturer?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter certificat calitate:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="certificatCalitate"
                        label="Certificat calitate"
                        type="text"
                        variant="outlined"
                        {...register("certificatCalitate")}
                      />
                    </FormControl>

                    {errors?.certificatCalitate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.certificatCalitate?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter order date:
                    </InputLabel>

                    <DatePicker
                      label="Order date"
                      value={
                        formData?.orderDate
                          ? dayjs(parseToDate(formData?.orderDate))
                          : null
                      }
                      onChange={(newValue) =>
                        handleSelectChange(
                          "orderDate",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : undefined,
                        )
                      }
                    />

                    {errors?.orderDate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.orderDate?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter invoice no:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="invoiceNo"
                        label="Invoice no"
                        type="text"
                        variant="outlined"
                        {...register("invoiceNo")}
                      />
                    </FormControl>

                    {errors?.invoiceNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.invoiceNo?.message as string}
                      </Typography>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="technical-info-content"
                id="technical-info-header"
              >
                <Typography component="span">Technical Info</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="p-4 flex flex-col gap-4 border-l">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter specifications:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="specifications"
                        label="Specifications"
                        type="text"
                        variant="outlined"
                        {...register("specifications")}
                      />
                    </FormControl>

                    {errors?.specifications && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.specifications?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter storage/handling notes:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="storageHandlingNotes"
                        label="Storage/Handling notes"
                        type="text"
                        variant="outlined"
                        {...register("storageHandlingNotes")}
                      />
                    </FormControl>

                    {errors?.storageHandlingNotes && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.storageHandlingNotes?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter shelf life/expiry date:
                    </InputLabel>

                    <DatePicker
                      label="Expiry date"
                      value={
                        formData?.expiryDate
                          ? dayjs(parseToDate(formData?.expiryDate))
                          : null
                      }
                      onChange={(newValue) =>
                        handleSelectChange(
                          "expiryDate",
                          newValue
                            ? Timestamp.fromDate(newValue.toDate())
                            : undefined,
                        )
                      }
                    />

                    {errors?.expiryDate && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.expiryDate?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Controller
                      name="organicBiodynamicStatus"
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
                          label="Organic/Biodynamic status"
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter compatible equipment:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="compatibleEquipment"
                        label="Compatible equipment"
                        type="text"
                        variant="outlined"
                        {...register("compatibleEquipment")}
                      />
                    </FormControl>

                    {errors?.compatibleEquipment && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.compatibleEquipment?.message as string}
                      </Typography>
                    )}
                  </div>
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
