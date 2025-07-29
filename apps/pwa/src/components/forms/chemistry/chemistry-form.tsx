"use client";

import { useChemistry } from "@/context/chemistry";
import { MASS_UNITS } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { chemistrySchema } from "@/models/schemas/chemistry-schema";
import {
  Chemistry,
  ChemistryType,
  DbResponse,
  FormMode,
  StageOfProduction,
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
  Autocomplete,
  Box,
  Button,
  FormControl,
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
import { useForm } from "react-hook-form";

export default function ChemistryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const close = useDialogDrawerStore(({ close }) => close);
  const closeDrawer = useCallback(() => close("form-drawer"), [close]);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const formType: FormMode = selected.length > 0 ? "edit" : "create";

  const { chemistry } = useChemistry();
  const existingItem = chemistry?.find(({ id }) => id === selected[0]?.id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Chemistry>({
    resolver: joiResolver(chemistrySchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Chemistry | undefined>();

  const handleSelectChange = useCallback(
    (name: keyof Chemistry, value: Chemistry[keyof Chemistry]) => {
      setValue(name as keyof Chemistry, value);
      setFormData((prev) => ({ ...(prev as Chemistry), [name]: value }));
    },
    [setValue]
  );

  const handleCreateChemistryItem = useCallback(
    async (uid: string, data: Chemistry) => {
      if (formType === "create") {
        data.group = [data.name];
        data.rowType = "item";
      }

      try {
        const getOneRes: DbResponse = await db.chemistry.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
          };

          const updateRes: DbResponse = await db.chemistry.update(
            uid,
            id,
            newData
          );

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error updating chemistry item`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.chemistry.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer();
          } else {
            enqueueSnackbar(`Error creating chemistry item`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
          "Error creating document or subcollection with data: ",
          e
        );

        enqueueSnackbar(`Error creating chemistry item`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, formType]
  );

  const onSubmit = async (data: Chemistry) => {
    setIsSubmitting(true);

    try {
      await handleCreateChemistryItem(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const chemistryItemID = `Chemistry_${chemistry?.filter(({ rowType }) => rowType !== "group")?.length + 1}`;

    const formatted = {
      ...existingItem,
      ...(!existingItem && {
        id: Date.now().toString(),
        chemistryID: chemistryItemID,
      }),
    } as Chemistry;

    reset(formatted);
    setFormData(formatted);
  }, [chemistry, existingItem, reset]);

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
                        id={formData?.id as Chemistry["id"]}
                        value={formData?.id || ""}
                        type="hidden"
                        {...register("id")}
                      />
                    </FormControl>
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
                            : undefined
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
                        id="chemistryID"
                        label="Chemistry item ID"
                        type="text"
                        variant="outlined"
                        {...register("chemistryID")}
                      />
                    </FormControl>

                    {errors?.chemistryID && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.chemistryID?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <InputLabel className="text-sm text-muted-foreground">
                        Select type:
                      </InputLabel>

                      <FormControl>
                        <Autocomplete
                          freeSolo
                          options={Object.values(ChemistryType)}
                          value={formData?.type || ""}
                          onChange={(_event, newValue) => {
                            handleSelectChange("type", newValue || "");
                          }}
                          onInputChange={(_event, newInputValue) => {
                            handleSelectChange("type", newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Type"
                              variant="outlined"
                            />
                          )}
                        />
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter quantity:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="qty"
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          {...register("qty")}
                        />
                      </FormControl>

                      <Box sx={{ width: "40px" }}>{MASS_UNITS[0] || "kg"}</Box>
                    </Stack>

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
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="general-info-content"
                id="general-info-header"
              >
                <Typography component="span">
                  Usage & Compliance Record
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="p-4 flex flex-col gap-4 border-l">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Select used stage of production:
                    </InputLabel>

                    <FormControl>
                      <Select
                        name="stageOfProduction"
                        id="stageOfProduction"
                        variant="outlined"
                        value={formData?.stageOfProduction ?? ""}
                        onChange={(e) =>
                          handleSelectChange(
                            "stageOfProduction",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {Object.values(StageOfProduction).map((stage) => {
                          return (
                            <MenuItem key={stage} value={stage}>
                              {stage}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    {errors?.stageOfProduction && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.stageOfProduction?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter recommended dosage:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="recommendedDosage"
                          label="Recommended dosage"
                          type="number"
                          variant="outlined"
                          {...register("recommendedDosage")}
                        />
                      </FormControl>

                      <Box sx={{ width: "40px" }}>/dm³</Box>
                    </Stack>

                    {errors?.recommendedDosage && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.recommendedDosage?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter maximum admisible dosage:
                    </InputLabel>

                    <Stack direction="row" gap={2} alignItems="center">
                      <FormControl sx={{ flex: 1 }}>
                        <Input
                          id="maxDosage"
                          label="Maximum admisible dosage"
                          type="number"
                          variant="outlined"
                          {...register("maxDosage")}
                        />
                      </FormControl>

                      <Box sx={{ width: "40px" }}>/dm³</Box>
                    </Stack>

                    {errors?.maxDosage && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.maxDosage?.message as string}
                      </Typography>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter expiry date:
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
                            : undefined
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
                      Enter certificat de calitate:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="certificatCalitate"
                        label="Certificat de calitate"
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
                      Enter minimum stock alert:
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

            <Accordion defaultExpanded>
              <AccordionDetails>
                <div className="p-4 flex flex-col gap-4 border-l">
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter legal/use notes:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="legalUseNotes"
                        label="Legal/Use notes"
                        type="text"
                        variant="outlined"
                        {...register("legalUseNotes")}
                      />
                    </FormControl>

                    {errors?.legalUseNotes && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.legalUseNotes?.message as string}
                      </Typography>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <InputLabel className="text-sm text-muted-foreground">
                      Enter comments:
                    </InputLabel>

                    <FormControl>
                      <Input
                        id="comments"
                        label="Comments"
                        type="text"
                        variant="outlined"
                        {...register("comments")}
                      />
                    </FormControl>

                    {errors?.comments && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.comments?.message as string}
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
