/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { REPORTS } from "@/components/dashboards/reports/reports-dashboard";
import {
  Box,
  Button,
  Chip,
  Link,
  Stack,
  Typography as MuiTypography,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import {
  Anexa14Data,
  ParcelClassification,
  ReducedVineyard,
} from "@/models/types/reports";
import formatDate from "@/utils/date-format";
import { DEFAULT_LOCALE } from "@/data/constants";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { anexa14Schema } from "@/models/schemas/anexa14-schema";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import { DbResponse, Vineyard, VineyardInfo } from "@/models/types/db";
import { db } from "@/lib/firebase/services";

import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { parseToDate } from "@/utils/date-format";
import { Timestamp } from "firebase/firestore";
import { useAnexa14List } from "@/context/anexa14";
import { useVineyard } from "@/context/vineyard";
import { useGrape } from "@/context/grape";
import { useWinery } from "@/context/winery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Add, Remove } from "@mui/icons-material";
import {
  Completed,
  editableCellStyle,
  EditableQty,
  filterByClassification,
  generateEmptyCells,
  generateEmptyRows,
  getVineyardBatchesQty,
  PARCELS,
  StyledDatePicker,
  TextField,
  Typography,
} from "./components";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";

export default function Anexa14Page({ anexa14Id }: { anexa14Id: string }) {
  const [currentId, setCurrentId] = useState<string | undefined>(
    anexa14Id === "new" ? "" : anexa14Id
  );

  const [isEditing, setIsEditing] = useState(true);

  const report = REPORTS.find(({ id }) => id === 1)!;

  const { vineyards } = useVineyard();
  const { grapes } = useGrape();
  const { teamMembers } = useWinery();

  const router = useRouter();

  const totalVineyardsArea = vineyards.reduce(
    (sum: number, { info }) => (sum += +info?.location?.surface || 0),
    0
  );

  const { anexa14List } = useAnexa14List();
  const anexa14 = anexa14List.find(({ id }) => id === currentId);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId =
    teamMembers?.find(({ email }) => email === user?.email)?.id ||
    user?.email ||
    "";

  const defaultAnexa14Data = useMemo(
    () =>
      ({
        id: crypto.randomUUID(),
        declarant: {
          name: "",
          wineRegisterUniqueId: "",
          identityCardNo: "",
          address: "",
          telFax: "",
        },
        harvest: {
          unit: "ha",
          totalVineyardsArea: totalVineyardsArea > 0 ? totalVineyardsArea : "",
          freshConsumption: "",
        },
        parcelVineyards: [],
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: userId,
        date: Timestamp.fromDate(new Date()),
      }) as unknown as Anexa14Data,
    [totalVineyardsArea, userId]
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Anexa14Data>({
    resolver: joiResolver(anexa14Schema, { stripUnknown: true }),
    defaultValues: anexa14 || defaultAnexa14Data,
  });

  const [formData, setFormData] = useState<Anexa14Data | undefined>();

  const {
    declarant,
    harvest,
    date,
    parcelVineyards = [],
  } = formData || ({} as Anexa14Data);

  const parcelsWINE_PDO: ReducedVineyard[] = Array.isArray(parcelVineyards)
    ? filterByClassification(parcelVineyards, ParcelClassification.WINE_PDO)
    : [];

  const parcelsWINE_PGI: ReducedVineyard[] = Array.isArray(parcelVineyards)
    ? filterByClassification(parcelVineyards, ParcelClassification.WINE_PGI)
    : [];

  const parcelsWINE_VARIETY_GENERIC: ReducedVineyard[] = Array.isArray(
    parcelVineyards
  )
    ? filterByClassification(
        parcelVineyards,
        ParcelClassification.WINE_VARIETY_GENERIC
      )
    : [];

  const parcelsWINE_GENERIC: ReducedVineyard[] = Array.isArray(parcelVineyards)
    ? filterByClassification(parcelVineyards, ParcelClassification.WINE_GENERIC)
    : [];

  const parcelsOTHER_DESTINATIONS: ReducedVineyard[] = Array.isArray(
    parcelVineyards
  )
    ? filterByClassification(
        parcelVineyards,
        ParcelClassification.OTHER_DESTINATIONS
      )
    : [];

  const parcelsTypes: Record<ParcelClassification, Array<ReducedVineyard>> = {
    [ParcelClassification.WINE_PDO]: parcelsWINE_PDO,
    [ParcelClassification.WINE_PGI]: parcelsWINE_PGI,
    [ParcelClassification.WINE_VARIETY_GENERIC]: parcelsWINE_VARIETY_GENERIC,
    [ParcelClassification.WINE_GENERIC]: parcelsWINE_GENERIC,
    [ParcelClassification.OTHER_DESTINATIONS]: parcelsOTHER_DESTINATIONS,
  };

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Anexa14Data, value);

      const names = name?.split(".");

      if (names.length > 1) {
        setFormData((prev) => ({
          ...(prev as Anexa14Data),
          [names[0]]: {
            [names[1]]: value,
          },
        }));
      } else {
        setFormData((prev) => ({ ...(prev as Anexa14Data), [name]: value }));
      }
    },
    [setValue]
  );

  const handleCancelEditing = () => {
    setIsEditing(false);
    reset(anexa14 || defaultAnexa14Data);
  };

  const handleCreateAnexa14 = useCallback(
    async (uid: string, data: Anexa14Data) => {
      try {
        const getOneRes: DbResponse = await db.anexa14.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id } = data;

          const newData = {
            ...data,
            modifiedBy: userId,
            modifiedAt: Timestamp.fromDate(new Date()),
          };

          const updateRes: DbResponse = await db.anexa14.update(
            uid,
            id,
            newData
          );

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated ${name} successfully`, {
              variant: "success",
            });
          } else {
            enqueueSnackbar(`Error updating`, {
              variant: "error",
            });
          }
        } else {
          const createRes: DbResponse = await db.anexa14.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created successfully`, {
              variant: "success",
            });

            if (data?.id) {
              setCurrentId(data.id);
              router.push(`/workspace/reports/anexa14/${data.id}`);
            }
          } else {
            enqueueSnackbar(`Error creating`, {
              variant: "error",
            });
          }
        }
      } catch (e) {
        console.error(
          "Error creating document or subcollection with data: ",
          e
        );

        enqueueSnackbar(`Error creating`, {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, router, userId]
  );

  const onSubmit = async (data: Anexa14Data) => {
    setIsSubmitting(true);

    try {
      await handleCreateAnexa14(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
    setIsEditing(false);
  };

  const canAddParcels = (type: ParcelClassification) =>
    vineyards.filter(({ rowType }) => rowType === "item").length >
    (formData?.parcelVineyards || []).filter(
      ({ parcelClassification }) => parcelClassification === type
    ).length;

  const handleAddParcels = (type: ParcelClassification) => {
    const parcel = {
      parcelClassification: type,
      id: crypto.randomUUID(),
      vineyardId: "",
      name: "",
      surface: "",
      parcelCode: "",
      grapeVariety: "",
      totalHarvestedQty: "",
      unit: "tone",
      totalHarvestedQtyWhite: "",
      wine: "",
      wineWhite: "",
      delivered: "",
      deliveredWhite: "",
      deliveredMust: "",
      deliveredMustWhite: "",
      sold: "",
      soldWhite: "",
      soldMust: "",
      soldMustWhite: "",
      other: "",
    };

    handleChange("parcelVineyards", [
      ...(formData?.parcelVineyards || []),
      parcel,
    ]);
  };

  const handleRemoveParcel = (parcelId: string) => {
    const parcelVineyards = formData?.parcelVineyards?.filter(
      ({ id }) => id !== parcelId
    );

    handleChange("parcelVineyards", parcelVineyards);
  };

  const handleParcelChange = (
    vineyardId: Vineyard["id"],
    editableName: string,
    editableValue: string,
    type?: ParcelClassification
  ) => {
    const updated = formData?.parcelVineyards?.map((vineyard2) => ({
      ...vineyard2,
      ...(vineyard2.vineyardId === vineyardId &&
        (!type || vineyard2.parcelClassification === type) && {
          [editableName]:
            editableName === "grapeVariety" || editableName === "parcelCode"
              ? editableValue
              : Number(editableValue),
        }),
    }));

    handleChange("parcelVineyards", updated);
  };

  useEffect(() => {
    setFormData(anexa14 || defaultAnexa14Data);
  }, [anexa14, defaultAnexa14Data]);

  useEffect(() => {
    console.log("ERRORS:", errors);
  }, [errors]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 90px)",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "left",
          justifyContent: "center",
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
          <Stack
            className="no-print"
            direction="row"
            sx={{ alignItems: "center", justifyContent: "center", pb: 2 }}
          >
            <Stack direction="row" gap={0.5} sx={{ flex: 1 }}>
              <Link href="/workspace/reports/anexa14">
                <Button
                  disabled={isSubmitting}
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                />
              </Link>

              <Stack gap={0.5} sx={{ flex: 1 }}>
                <Stack
                  gap={1}
                  direction="row"
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Stack
                    gap={1}
                    direction="row"
                    sx={{ flex: 1, alignItems: "center" }}
                  >
                    <MuiTypography variant="h5">{report.title}</MuiTypography>
                    <Chip
                      size="small"
                      label={anexa14Id}
                      sx={{ lineHeight: 1.2 }}
                    />

                    {isEditing && (
                      <Chip
                        size="small"
                        label="editing"
                        color="success"
                        sx={{ lineHeight: 1.2 }}
                      />
                    )}
                  </Stack>
                </Stack>

                {report.subtitle && (
                  <Typography fontSize="16px">({report.subtitle})</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack className="print-style" sx={{ flex: 1, overflowY: "auto" }}>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: {
                  sx: "flex-start",
                  lg: "center",
                },
              }}
            >
              <Stack
                className="print-style"
                sx={{
                  p: 1,
                  gap: 1,
                  fontFamily: "Times New Roman",
                  fontSize: "16px",
                  //border: "1px solid #e0e0e0",
                  //maxWidth: "700px",
                }}
              >
                <Stack
                  sx={{
                    alignItems: "flex-end",
                  }}
                >
                  <Typography>Anexa nr. 14</Typography>
                  <Typography>la Regulamentul privind organizarea</Typography>
                  <Typography>pieței vitivinicole</Typography>
                </Stack>

                <Stack
                  className="print-style-title"
                  sx={{
                    alignItems: "center",
                    fontSize: "17px",
                    fontWeight: 700,
                    pb: 1,
                  }}
                >
                  <Typography>DECLARAŢIA</Typography>
                  <Typography>privind recolta totală de struguri</Typography>
                </Stack>

                <Stack sx={{ gap: 2, flexDirection: "row" }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Datele declarantului:
                  </Typography>

                  <Stack sx={{ gap: 0.5, flex: 1 }}>
                    <Stack
                      sx={{ flexDirection: "row", alignItems: "flex-end" }}
                    >
                      <Typography sx={{ flex: 0 }}>Denumirea</Typography>

                      <Box
                        sx={{
                          width: "50%",
                          textAlign: "center",
                          borderBottom: isEditing
                            ? ""
                            : "1px solid var(--anexa14-border-color)",
                        }}
                      >
                        {isEditing ? (
                          <>
                            <div className="hidden">
                              <FormControl>
                                <TextField
                                  id={formData?.id as Anexa14Data["id"]}
                                  value={formData?.id || ""}
                                  type="hidden"
                                  {...register("id")}
                                />
                              </FormControl>
                            </div>

                            <TextField
                              fullWidth
                              id="name"
                              size="small"
                              {...register("declarant.name")}
                            />
                          </>
                        ) : (
                          <Completed>{declarant?.name}</Completed>
                        )}
                      </Box>
                    </Stack>

                    {errors?.declarant?.name && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.declarant?.name?.message as string}
                      </Typography>
                    )}

                    <Stack
                      sx={{
                        gap: 0.0,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                        Nr. identificatorului unic al declarantului din
                        Registrul vitivinicol
                      </Typography>

                      <Box
                        sx={{
                          width: "50%",
                          textAlign: "center",
                          borderBottom: isEditing
                            ? ""
                            : "1px solid var(--anexa14-border-color)",
                        }}
                      >
                        {isEditing ? (
                          <TextField
                            fullWidth
                            id="wineRegisterUniqueId"
                            size="small"
                            {...register("declarant.wineRegisterUniqueId")}
                          />
                        ) : (
                          <Completed>
                            {declarant?.wineRegisterUniqueId}
                          </Completed>
                        )}
                      </Box>
                    </Stack>

                    {errors?.declarant?.wineRegisterUniqueId && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {
                          errors?.declarant?.wineRegisterUniqueId
                            ?.message as string
                        }
                      </Typography>
                    )}

                    <Stack
                      sx={{
                        gap: 0.5,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                        Buletinul de identitate nr.
                      </Typography>

                      <Box
                        sx={{
                          width: "50%",
                          textAlign: "center",
                          borderBottom: isEditing
                            ? ""
                            : "1px solid var(--anexa14-border-color)",
                        }}
                      >
                        {isEditing ? (
                          <TextField
                            fullWidth
                            id="identityCardNo"
                            size="small"
                            {...register("declarant.identityCardNo")}
                          />
                        ) : (
                          <Completed>{declarant?.identityCardNo}</Completed>
                        )}
                      </Box>
                    </Stack>

                    {errors?.declarant?.identityCardNo && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.declarant?.identityCardNo?.message as string}
                      </Typography>
                    )}

                    <Stack
                      sx={{
                        gap: 0.5,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                        Adresa
                      </Typography>

                      <Box
                        sx={{
                          width: "50%",
                          textAlign: "center",
                          borderBottom: isEditing
                            ? ""
                            : "1px solid var(--anexa14-border-color)",
                        }}
                      >
                        {isEditing ? (
                          <TextField
                            fullWidth
                            id="address"
                            size="small"
                            {...register("declarant.address")}
                          />
                        ) : (
                          <Completed>{declarant?.address}</Completed>
                        )}
                      </Box>

                      {errors?.declarant?.address && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.declarant?.address?.message as string}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          flex: 0,
                          whiteSpace: "nowrap",
                          alignItems: "flex-end",
                        }}
                      >
                        Tel./fax
                      </Typography>

                      <Box
                        sx={{
                          width: "30%",
                          textAlign: "center",
                          borderBottom: isEditing
                            ? ""
                            : "1px solid var(--anexa14-border-color)",
                        }}
                      >
                        {isEditing ? (
                          <TextField
                            fullWidth
                            id="telFax"
                            size="small"
                            {...register("declarant.telFax")}
                          />
                        ) : (
                          <Completed>{declarant?.telFax}</Completed>
                        )}
                      </Box>
                    </Stack>

                    {errors?.declarant?.telFax && (
                      <Typography
                        variant="body2"
                        color="error"
                        className="mt-1"
                      >
                        {errors?.declarant?.telFax?.message as string}
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack
                  sx={{
                    gap: 0.5,
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                    Suprafaţa plantaţiilor vinicole
                  </Typography>

                  <Box
                    sx={{
                      width: "100px",
                      textAlign: "center",
                      borderBottom: isEditing
                        ? ""
                        : "1px solid var(--anexa14-border-color)",
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        fullWidth
                        id="totalVineyardsArea"
                        size="small"
                        {...register("harvest.totalVineyardsArea")}
                      />
                    ) : (
                      <Completed>{harvest?.totalVineyardsArea}</Completed>
                    )}
                  </Box>

                  <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                    ha,
                  </Typography>

                  <Box
                    sx={{
                      width: "30%",
                    }}
                  />

                  <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                    dintre care soiuri de masă
                  </Typography>

                  <Box
                    sx={{
                      width: "100px",
                      textAlign: "center",
                      borderBottom: isEditing
                        ? ""
                        : "1px solid var(--anexa14-border-color)",
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        fullWidth
                        id="freshConsumption"
                        size="small"
                        {...register("harvest.freshConsumption")}
                      />
                    ) : (
                      <Completed>{harvest?.freshConsumption}</Completed>
                    )}
                  </Box>

                  <Typography>ha</Typography>

                  <Box
                    sx={{
                      width: "20%",
                    }}
                  />
                </Stack>

                {errors?.harvest?.totalVineyardsArea && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.harvest?.totalVineyardsArea?.message as string}
                  </Typography>
                )}

                {errors?.harvest?.freshConsumption && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.harvest?.freshConsumption?.message as string}
                  </Typography>
                )}

                <Stack>
                  <table
                    id="anexa14"
                    className="table-auto border-collapse border border-gray-500"
                  >
                    <thead>
                      <tr>
                        <th rowSpan={4}>Destinaţia strugurilor</th>
                        <th rowSpan={3} colSpan={2}>
                          Suprafaţa aflată în producţie
                        </th>
                        <th rowSpan={4}>
                          Denumirea soiului/amestecului de soiuri de struguri
                        </th>
                        <th rowSpan={3} colSpan={2}>
                          Cantitatea de struguri recoltată, dal/t
                        </th>
                        <th colSpan={11}>Destinaţia strugurilor, dal/t</th>
                      </tr>

                      <tr>
                        <th colSpan={2} rowSpan={2}>
                          Vinificaţi de declarant (1)
                        </th>
                        <th colSpan={4}>
                          Livraţi unei cooperative vinicole (1)
                        </th>
                        <th colSpan={4}>Vînduţi unui vinificator (1)</th>
                        <th rowSpan={3}>Alte destinaţii (1)</th>
                      </tr>

                      <tr>
                        <th colSpan={2}>struguri, t</th>
                        <th colSpan={2}>must, dal</th>
                        <th colSpan={2}>struguri, t</th>
                        <th colSpan={2}>must, dal</th>
                      </tr>

                      <tr>
                        <th>ha</th>
                        <th>codul parcelei</th>
                        <th>roşu</th>
                        <th>alb</th>
                        <th>roşu</th>
                        <th>alb</th>
                        <th>roşu</th>
                        <th>alb</th>
                        <th>roşu</th>
                        <th>alb</th>
                        <th>roşu</th>
                        <th>alb</th>
                        <th>roşu</th>
                        <th>alb</th>
                      </tr>
                    </thead>

                    <tbody>
                      {PARCELS.map(({ type, title }, index) => (
                        <Fragment key={`${type}-${index}`}>
                          <tr>
                            <td /*style={{ minWidth: "106px" }}*/>
                              <Stack
                                direction="row"
                                sx={{ alignItems: "center" }}
                              >
                                <Typography sx={{ flex: 1 }}>
                                  {title}
                                </Typography>

                                {isEditing && canAddParcels(type) && (
                                  <IconButton
                                    onClick={() => handleAddParcels(type)}
                                    size="small"
                                  >
                                    <Add
                                      sx={{
                                        color: "primary.main",
                                        width: "18px",
                                        height: "18px",
                                      }}
                                    />
                                  </IconButton>
                                )}
                              </Stack>
                            </td>
                            {generateEmptyCells(16)}
                          </tr>

                          {!isEditing &&
                            parcelsTypes[type]?.length === 0 &&
                            generateEmptyRows(2)}

                          {(parcelsTypes[type] || []).map(
                            (
                              {
                                id,
                                vineyardId = "",
                                name = "",
                                surface = "",
                                parcelCode = "",
                                grapeVariety = "",
                                totalHarvestedQty = "",
                                wine = "",
                                delivered = "",
                                deliveredMust = "",
                                sold = "",
                                soldMust = "",
                                other = "",
                                totalHarvestedQtyWhite = "",
                                wineWhite = "",
                                deliveredWhite = "",
                                deliveredMustWhite = "",
                                soldWhite = "",
                                soldMustWhite = "",
                              },
                              index
                            ) => (
                              <Fragment
                                key={`${vineyardId}-${type}-${name}-${index}`}
                              >
                                <tr>
                                  <td style={{ textAlign: "center" }}>
                                    <Stack
                                      direction="row"
                                      sx={{
                                        padding: 0,
                                        margin: 0,
                                        alignItems: "center",
                                      }}
                                    >
                                      <span>&nbsp;{index + 1}.&nbsp;</span>

                                      {isEditing ? (
                                        <>
                                          <Autocomplete
                                            noOptionsText="No vineyards available"
                                            options={vineyards
                                              .filter(
                                                ({ id, rowType }) =>
                                                  rowType === "item" &&
                                                  !formData?.parcelVineyards?.some(
                                                    ({
                                                      vineyardId,
                                                      parcelClassification,
                                                    }) =>
                                                      vineyardId === id &&
                                                      type ===
                                                        parcelClassification
                                                  )
                                              )
                                              .map(
                                                ({
                                                  id,
                                                  name,
                                                  info,
                                                  batches,
                                                  grapeVariety,
                                                }) => ({
                                                  id,
                                                  name,
                                                  info,
                                                  batches,
                                                  grapeVariety,
                                                })
                                              )}
                                            value={{
                                              id,
                                              name,
                                              grapeVariety,
                                              info: {} as VineyardInfo,
                                              batches: [],
                                            }}
                                            getOptionLabel={(option) =>
                                              option.name
                                            }
                                            filterSelectedOptions
                                            onChange={(_event, vineyard) => {
                                              if (!vineyard) return;

                                              const existingParcel =
                                                Array.isArray(
                                                  formData?.parcelVineyards
                                                )
                                                  ? formData?.parcelVineyards?.find(
                                                      ({
                                                        vineyardId = "",
                                                        name = "",
                                                        parcelClassification = "",
                                                      }) =>
                                                        ((vineyardId !== "" &&
                                                          vineyardId ===
                                                            vineyard?.id) ||
                                                          (name !== "" &&
                                                            name ===
                                                              vineyard?.name)) &&
                                                        parcelClassification ===
                                                          type
                                                    )
                                                  : undefined;

                                              if (existingParcel) return;

                                              const existing = Array.isArray(
                                                formData?.parcelVineyards
                                              )
                                                ? formData?.parcelVineyards?.find(
                                                    ({
                                                      vineyardId = "",
                                                      name = "",
                                                    }) =>
                                                      (vineyardId !== "" &&
                                                        vineyardId ===
                                                          vineyard?.id) ||
                                                      (name !== "" &&
                                                        name === vineyard?.name)
                                                  )
                                                : undefined;

                                              const updated =
                                                formData?.parcelVineyards?.map(
                                                  (vineyard2) => ({
                                                    ...vineyard2,
                                                    ...(vineyard2.id === id && {
                                                      vineyardId: vineyard.id,
                                                      name: vineyard.name || "",
                                                      surface:
                                                        existing?.surface ||
                                                        +vineyard.info?.location
                                                          ?.surface ||
                                                        "",
                                                      parcelCode:
                                                        existing?.parcelCode ||
                                                        "",
                                                      grapeVariety:
                                                        existing?.grapeVariety ||
                                                        vineyard.grapeVariety ||
                                                        "",
                                                      totalHarvestedQty:
                                                        existing?.totalHarvestedQty ||
                                                        getVineyardBatchesQty(
                                                          vineyard.batches ||
                                                            [],
                                                          grapes
                                                        ) ||
                                                        "",
                                                      totalHarvestedQtyWhite:
                                                        existing?.totalHarvestedQtyWhite ||
                                                        getVineyardBatchesQty(
                                                          vineyard.batches ||
                                                            [],
                                                          grapes
                                                        ) ||
                                                        "",
                                                    }),
                                                  })
                                                );

                                              handleChange(
                                                "parcelVineyards",
                                                updated
                                              );
                                            }}
                                            sx={{ flex: 1 }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                //label="Vineyard"
                                                //variant="outlined"
                                                fullWidth
                                                size="small"
                                              />
                                            )}
                                          />

                                          <IconButton
                                            onClick={() =>
                                              handleRemoveParcel(id)
                                            }
                                            size="small"
                                          >
                                            <Remove
                                              sx={{
                                                color: "error.main",
                                                width: "18px",
                                                height: "18px",
                                              }}
                                            />
                                          </IconButton>
                                        </>
                                      ) : (
                                        <Completed sx={{ flex: 1 }}>
                                          {name}
                                        </Completed>
                                      )}
                                    </Stack>
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="surface"
                                        value={surface}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "surface",
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{surface}</Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="parcelCode"
                                        value={parcelCode}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "parcelCode",
                                            e.target.value
                                          )
                                        }
                                        sx={{
                                          width: "100%",
                                        }}
                                      />
                                    ) : (
                                      <Completed>{parcelCode || ""}</Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="grapeVariety"
                                        value={grapeVariety}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "grapeVariety",
                                            e.target.value
                                          )
                                        }
                                        sx={{
                                          width: "100%",
                                        }}
                                      />
                                    ) : (
                                      <Completed>
                                        {grapeVariety || ""}
                                      </Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="totalHarvestedQty"
                                        value={totalHarvestedQty}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "totalHarvestedQty",
                                            e.target.value
                                          )
                                        }
                                        sx={{
                                          width: "100%",
                                        }}
                                      />
                                    ) : (
                                      <Completed>
                                        {totalHarvestedQty || ""}
                                      </Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="totalHarvestedQtyWhite"
                                        value={totalHarvestedQtyWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "totalHarvestedQtyWhite",
                                            e.target.value
                                          )
                                        }
                                        sx={{
                                          width: "100%",
                                        }}
                                      />
                                    ) : (
                                      <Completed>
                                        {totalHarvestedQtyWhite || ""}
                                      </Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="wine"
                                        value={wine}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "wine",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{wine || ""}</Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="wineWhite"
                                        value={wineWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "wineWhite",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{wineWhite || ""}</Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="delivered"
                                        value={delivered}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "delivered",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{delivered || ""}</Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="deliveredWhite"
                                        value={deliveredWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "deliveredWhite",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>
                                        {deliveredWhite || ""}
                                      </Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="deliveredMust"
                                        value={deliveredMust}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "deliveredMust",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>
                                        {deliveredMust || ""}
                                      </Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="deliveredMustWhite"
                                        value={deliveredMustWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "deliveredMustWhite",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>
                                        {deliveredMustWhite || ""}
                                      </Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="sold"
                                        value={sold}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "sold",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{sold || ""}</Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="soldWhite"
                                        value={soldWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "soldWhite",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{soldWhite || ""}</Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="soldMust"
                                        value={soldMust}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "soldMust",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{soldMust || ""}</Completed>
                                    )}
                                  </td>
                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="soldMustWhite"
                                        value={soldMustWhite}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "soldMustWhite",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>
                                        {soldMustWhite || ""}
                                      </Completed>
                                    )}
                                  </td>

                                  <td style={editableCellStyle(isEditing)}>
                                    {isEditing ? (
                                      <EditableQty
                                        name="other"
                                        value={other}
                                        onChange={(e) =>
                                          handleParcelChange(
                                            vineyardId,
                                            "other",
                                            e.target.value,
                                            type
                                          )
                                        }
                                      />
                                    ) : (
                                      <Completed>{other || ""}</Completed>
                                    )}
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          )}
                        </Fragment>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colSpan={17}>
                          <Stack
                            direction="row"
                            sx={{ px: 0.5, py: 0.2, gap: 0.5 }}
                          >
                            <Typography>Note:</Typography>
                            <Stack>
                              <Typography>
                                <sup>(1)</sup> se precizează cantităţile de
                                struguri livrate sau vîndute de către declarant,
                                în volum total. Detaliile acestor livrări sau
                                vînzări sînt specificate în anexa nr. 16;
                              </Typography>
                              <Typography>
                                <sup>(2)</sup> se precizează soiurile de
                                struguri de vinificaţie şi, după caz, soiurile
                                de struguri de masă, soiurile de struguri de
                                stafide sau soiurile de struguri destinaţi
                                fabricării de rachiu de vin.
                              </Typography>
                            </Stack>
                          </Stack>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </Stack>

                <Stack
                  className="print-style"
                  sx={{
                    flexDirection: "row",
                    mt: 3,
                    fontSize: "16px",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography sx={{ flex: 0 }}>Data</Typography>

                  <Box
                    sx={{
                      width: "100px",
                      textAlign: "center",
                      borderBottom: isEditing
                        ? ""
                        : "1px solid var(--anexa14-border-color)",
                    }}
                  >
                    {isEditing ? (
                      <StyledDatePicker
                        label=""
                        value={
                          formData?.date
                            ? dayjs(parseToDate(formData?.date))
                            : null
                        }
                        onChange={(newValue) =>
                          handleChange(
                            "date",
                            newValue
                              ? Timestamp.fromDate(newValue.toDate())
                              : undefined
                          )
                        }
                      />
                    ) : (
                      <Completed>
                        {date && formatDate(date, { locale: DEFAULT_LOCALE })}
                      </Completed>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: "30%",
                    }}
                  />

                  <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                    Semnătura declarantului
                  </Typography>

                  <Box
                    sx={{
                      width: "100px",
                      borderBottom: isEditing
                        ? ""
                        : "1px solid var(--anexa14-border-color)",
                    }}
                  />
                </Stack>

                {errors?.date && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.date?.message as string}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

          <Box
            className="no-print"
            sx={{
              px: 1,
              pt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Link href="/workspace/reports">
              <Button
                sx={{ textTransform: "uppercase", fontSize: "0.8125rem" }}
                endIcon={<AssessmentOutlinedIcon />}
                disabled={isSubmitting}
              >
                Reports
              </Button>
            </Link>

            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                size="small"
                color="error"
                sx={{ width: "100px", margin: 0 }}
                onClick={handleCancelEditing}
                endIcon={<CloseIcon />}
                disabled={isSubmitting || !isEditing}
              >
                Cancel
              </Button>

              <Button
                size="small"
                variant="contained"
                sx={{ width: "100px", margin: 0 }}
                endIcon={<SaveIcon />}
                disabled={isSubmitting || !isEditing}
                type="submit"
              >
                Save
              </Button>
            </Box>

            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                sx={{ width: "100px", margin: 0 }}
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={isSubmitting}
                endIcon={isEditing ? <WysiwygIcon /> : <EditDocumentIcon />}
              >
                {isEditing ? "View" : "Edit"}
              </Button>
            </Box>
          </Box>
        </form>
      </Stack>
    </Box>
  );
}
