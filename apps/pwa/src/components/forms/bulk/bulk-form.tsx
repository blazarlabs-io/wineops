"use client";

import { useBulk } from "@/context/bulk";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { bulkSchema } from "@/models/schemas/bulk-schema";
import { DbResponse, FormMode, Bulk } from "@/models/types/db";
import { parseToDate } from "@/utils/date-format";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Accordion,
  AccordionDetails,
  Box,
  Button,
  FormControl,
  TextField as Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type BulkProps = {
  children?: ReactNode;
  bulk?: Bulk;
  closeDrawer?: () => void;
  type?: FormMode;
};

export default function BulkForm({
  bulk,
  closeDrawer,
  type = "create",
}: BulkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { bulks } = useBulk();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Bulk>({
    resolver: joiResolver(bulkSchema, { stripUnknown: true }),
  });

  const [formData, setFormData] = useState<Bulk | undefined>(bulk);

  const handleSelectChange = useCallback(
    (name: keyof Bulk, value: Bulk[keyof Bulk]) => {
      setValue(name as keyof Bulk, value);
      setFormData((prev) => ({ ...(prev as Bulk), [name]: value }));
    },
    [setValue]
  );

  const handleCreateBulk = useCallback(
    async (uid: string, data: Bulk) => {
      if (type === "create") {
        data.group = [data.name];
        data.rowType = "item";
      }

      try {
        const getOneRes: DbResponse = await db.bulk.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id, name, group = formData?.group } = data;

          const newData = {
            ...data,
            group: [...(group ?? []).slice(0, -1), name ?? id],
          };

          const updateRes: DbResponse = await db.bulk.update(uid, id, newData);

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });

            closeDrawer?.();
          } else {
            enqueueSnackbar(`Error updating bulk`, {
              variant: "error",
            });
          }
        } else {
          data.group = [data.name];

          const createRes: DbResponse = await db.bulk.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created ${data.name} successfully`, {
              variant: "success",
            });

            closeDrawer?.();
          } else {
            enqueueSnackbar(`Error creating bulk`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e
        );

        enqueueSnackbar(`Error creating bulk`, {
          variant: "error",
        });
      }
    },
    [closeDrawer, enqueueSnackbar, formData?.group, type]
  );

  const onSubmit = async (data: Bulk) => {
    setIsSubmitting(true);

    try {
      await handleCreateBulk(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const bulkID = `Bulk_${bulks?.length + 1}`;

    const formatted = {
      ...bulk,
      ...(!bulk && {
        id: Date.now().toString(),
        //bulkID,
      }),
    } as Bulk;

    reset(formatted);
    setFormData(formatted);
  }, [reset, bulk, bulks?.length]);

  useEffect(() => {
    if (errors) {
      console.log("[BULK FORM ERRORS]", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          style={{
            background: "var(--mui-palette-background-default)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
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
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Accordion defaultExpanded>
                <AccordionDetails>
                  <div className="p-4 flex flex-col gap-4 border-l">
                    <div className="hidden">
                      <FormControl>
                        <Input
                          id={formData.id as Bulk["id"]}
                          value={formData.id}
                          type="hidden"
                          {...register("id")}
                        />
                      </FormControl>
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
                        Enter start date:
                      </InputLabel>

                      <DatePicker
                        label="Start date"
                        value={
                          formData?.startDate
                            ? dayjs(parseToDate(formData?.startDate))
                            : null
                        }
                        onChange={(newValue) =>
                          handleSelectChange(
                            "startDate",
                            newValue
                              ? Timestamp.fromDate(newValue.toDate())
                              : undefined
                          )
                        }
                      />

                      {errors?.startDate && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.startDate?.message as string}
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
                          label="Quantity (tonns)"
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
                zIndex: 1,
                flexShrink: 0,
                borderTop: "1px solid #ccc",
                background: "var(--mui-palette-background-default)",
              }}
            >
              <FormControl>
                <Button disabled={isSubmitting} onClick={() => closeDrawer?.()}>
                  Cancel
                </Button>
              </FormControl>

              <FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
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
