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
  Anexa7Data,
  Anexa7StockProduct,
  StockProductCategory,
} from "@/models/types/reports";
import formatDate from "@/utils/date-format";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { anexa7Schema } from "@/models/schemas/anexa7-schema";
import { useAuth } from "@/lib/firebase/auth";
import { useSnackbar } from "notistack";
import { DbResponse } from "@/models/types/db";
import { db } from "@/lib/firebase/services";

import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { parseToDate } from "@/utils/date-format";
import { Timestamp } from "firebase/firestore";
import { useAnexa7List } from "@/context/anexa7";
import { useWinery } from "@/context/winery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Add, Remove } from "@mui/icons-material";
import {
  Completed,
  editableCellStyle,
  EditableQty,
  filterByCategory,
  CATEGORIES,
  StyledDatePicker,
  TextField,
  Typography,
} from "./components";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import { useMust } from "@/context/must";
import { useWine } from "@/context/wine";
import { useBottle } from "@/context/bottle";

export default function Anexa7Page({ anexa7Id }: { anexa7Id: string }) {
  const [currentId, setCurrentId] = useState<string | undefined>(
    anexa7Id === "new" ? "" : anexa7Id,
  );

  const [isEditing, setIsEditing] = useState(true);

  const report = REPORTS.find(({ id }) => id === 2)!;

  const { musts } = useMust();
  const { wines } = useWine();
  const { bottles } = useBottle();

  const { teamMembers } = useWinery();

  const router = useRouter();

  const { anexa7List } = useAnexa7List();
  const anexa7 = anexa7List.find(({ id }) => id === currentId);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId =
    teamMembers?.find(
      ({ id, email }) =>
        email.toLowerCase() === user?.email?.toLowerCase() || id === user?.uid,
    )?.id ||
    user?.email ||
    user?.uid ||
    "";

  const defaultAnexa7Data = useMemo(
    () =>
      ({
        id: crypto.randomUUID(),
        numarInregistrareBDUV: "",
        identificatorUnicUnitateVinicola: "",
        declarant: {
          name: "",
          name2: "",
          idno_idnp: "",
        },
        stockProducts: [],
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: userId,
        date: Timestamp.fromDate(new Date()),
      }) as unknown as Anexa7Data,
    [userId],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    setError,
  } = useForm<Anexa7Data>({
    resolver: joiResolver(anexa7Schema, { stripUnknown: true }),
    defaultValues: anexa7 || defaultAnexa7Data,
  });

  const [formData, setFormData] = useState<Anexa7Data | undefined>();

  const {
    numarInregistrareBDUV,
    identificatorUnicUnitateVinicola,
    declarant,
    date,
    stockProducts = [],
  } = formData || ({} as Anexa7Data);

  const stockBulkWines: Anexa7StockProduct[] = Array.isArray(stockProducts)
    ? filterByCategory(stockProducts, StockProductCategory.BULK_WINE)
    : [];

  const stockBottledWines: Anexa7StockProduct[] = Array.isArray(stockProducts)
    ? filterByCategory(stockProducts, StockProductCategory.BOTTLED_WINE)
    : [];

  const stockProductsByCategories: Record<
    StockProductCategory,
    Array<Anexa7StockProduct>
  > = {
    [StockProductCategory.BULK_WINE]: stockBulkWines,
    [StockProductCategory.BOTTLED_WINE]: stockBottledWines,
  };

  const bulkWines = [
    ...(musts
      ?.filter(({ rowType }) => rowType === "item")
      ?.map(({ id, name, qty }) => ({ id, name, total: qty })) || []),
    ...(wines
      ?.filter(({ rowType }) => rowType === "item")
      ?.map(({ id, name, qty }) => ({ id, name, total: qty })) || []),
  ];

  const bottledWines =
    bottles
      ?.filter(({ rowType }) => rowType === "item")
      ?.map(({ id, name, vintage, collectionName, numberOfBottles }) => ({
        id,
        name: `${name || collectionName || ""} ${vintage || ""}`,
        total: numberOfBottles,
      })) || [];

  const productsByCategories: Record<
    StockProductCategory,
    Array<{ id: string; name: string; total?: number }>
  > = {
    [StockProductCategory.BULK_WINE]: bulkWines,
    [StockProductCategory.BOTTLED_WINE]: bottledWines,
  };

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValue(name as keyof Anexa7Data, value);

      const names = name?.split(".");

      if (names.length > 1) {
        setFormData((prev) => ({
          ...(prev as Anexa7Data),
          [names[0]]: {
            [names[1]]: value,
          },
        }));
      } else {
        setFormData((prev) => ({ ...(prev as Anexa7Data), [name]: value }));
      }
    },
    [setValue],
  );

  const handleCancelEditing = () => {
    setIsEditing(false);
    reset(anexa7 || defaultAnexa7Data);
  };

  const handleCreateAnexa7 = useCallback(
    async (uid: string, data: Anexa7Data) => {
      try {
        const getOneRes: DbResponse = await db.anexa7.getOne(uid, data.id);

        if (getOneRes.status === 200 && getOneRes.data !== null) {
          const { id } = data;

          const newData = {
            ...data,
            modifiedBy: userId,
            modifiedAt: Timestamp.fromDate(new Date()),
          };

          const updateRes: DbResponse = await db.anexa7.update(
            uid,
            id,
            newData,
          );

          setFormData(newData);

          if (updateRes.status === 200) {
            enqueueSnackbar(`Updated successfully`, {
              variant: "success",
            });
          } else {
            enqueueSnackbar(`Error updating`, {
              variant: "error",
            });
          }
        } else {
          const createRes: DbResponse = await db.anexa7.create(uid, data);

          setFormData(data);

          if (createRes.status === 200) {
            enqueueSnackbar(`Created successfully`, {
              variant: "success",
            });

            if (data?.id) {
              setCurrentId(data.id);
              router.push(`/workspace/reports/anexa7/${data.id}`);
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
          e,
        );

        enqueueSnackbar(`Error creating`, {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, router, userId],
  );

  const onSubmit = async (data: Anexa7Data) => {
    for (let index = 0; index < (data?.stockProducts?.length || 0); index++) {
      const stockProduct = data.stockProducts?.[index];

      if ((stockProduct?.total || 0) <= 0) {
        setError(`stockProducts.${index}.total`, {
          type: "manual",
          message: `Please enter a valid number`,
        });

        return;
      }

      if (
        stockProduct?.total !==
        (stockProduct?.red || 0) +
          (stockProduct?.rose || 0) +
          (stockProduct?.white || 0)
      ) {
        setError(`stockProducts.${index}.total`, {
          type: "manual",
          message: `Total (${stockProduct?.total}) must be equal with roşu + roz + alb`,
        });

        return;
      }
    }

    setIsSubmitting(true);

    try {
      await handleCreateAnexa7(user?.uid || "", data);
    } finally {
      setIsSubmitting(false);
    }
    setIsEditing(false);
  };

  const canAddStockProduct = (category: StockProductCategory) =>
    productsByCategories[category]?.length >
    (formData?.stockProducts || []).filter(
      (product) => product.category === category,
    ).length;

  const handleAddStockProduct = (category: StockProductCategory) => {
    const stockProduct = {
      category,
      id: crypto.randomUUID(),
      externalId: "",
      name: "",
      unit:
        category === StockProductCategory.BULK_WINE
          ? "dal"
          : category === StockProductCategory.BOTTLED_WINE
            ? "sticle"
            : "",
      total: "",
      red: "",
      rose: "",
      white: "",
    };

    handleChange("stockProducts", [
      ...(formData?.stockProducts || []),
      stockProduct,
    ]);
  };

  const handleRemoveStockProduct = (stockProductId: string) => {
    const stockProducts = formData?.stockProducts?.filter(
      ({ id }) => id !== stockProductId,
    );

    handleChange("stockProducts", stockProducts);
  };

  const handleStockProductChange = (
    externalId: Anexa7StockProduct["externalId"],
    editableName: string,
    editableValue: string,
    category?: StockProductCategory,
  ) => {
    const updated = formData?.stockProducts?.map((stockProduct) => ({
      ...stockProduct,
      ...(stockProduct.externalId === externalId &&
        (!category || stockProduct.category === category) && {
          [editableName]:
            editableName === "name" ? editableValue : Number(editableValue),
        }),
    }));

    handleChange("stockProducts", updated);
  };

  useEffect(() => {
    setFormData(anexa7 || defaultAnexa7Data);
  }, [anexa7, defaultAnexa7Data]);

  useEffect(() => {}, [errors]);

  useEffect(() => {}, [formData]);

  const handleBackClick = () => {
    router.push(`/workspace/reports/anexa7`);
  };

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
            <Stack
              direction="row"
              gap={0.5}
              sx={{ flex: 1, alignItems: "flex-start" }}
            >
              <IconButton onClick={handleBackClick} sx={{ mt: 0.6 }}>
                <ArrowBackIcon />
              </IconButton>

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
                      label={anexa7Id}
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
                }}
              >
                <Stack
                  sx={{
                    alignItems: "flex-end",
                  }}
                >
                  <Typography>Anexa nr. 7</Typography>
                  <Typography>la Regulamentul privind modul</Typography>
                  <Typography>de ţinere a Registrului vitivinicol</Typography>
                  <Typography>al Republicii Moldova</Typography>
                </Stack>

                <Stack
                  className="print-style-title"
                  sx={{
                    alignItems: "center",
                    fontSize: "20px",
                    fontWeight: 700,
                    pb: 1,
                  }}
                >
                  <Stack direction="row">
                    <Typography>Declaraţie de stoc - anul</Typography>
                    <Box
                      sx={{
                        width: "100px",
                        textAlign: "center",
                        borderBottom:
                          "1px solid var(--reports-table-border-color)",
                      }}
                    ></Box>
                  </Stack>
                </Stack>

                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "end",
                  }}
                >
                  <table className="anexa7 table-auto border-collapse border border-gray-500">
                    <tbody>
                      <tr>
                        <td className="p-1!">
                          (01) Numărul de înregistrare în BDUV
                        </td>
                        <td style={{ width: "160px" }}>
                          <Box
                            sx={{
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {isEditing ? (
                              <>
                                <TextField
                                  fullWidth
                                  id="numarInregistrareBDUV"
                                  size="small"
                                  {...register("numarInregistrareBDUV")}
                                />
                              </>
                            ) : (
                              <Completed>{numarInregistrareBDUV}</Completed>
                            )}

                            {errors?.numarInregistrareBDUV?.message && (
                              <Typography
                                variant="body2"
                                color="error"
                                className="mt-1"
                              >
                                {errors?.numarInregistrareBDUV?.message}
                              </Typography>
                            )}
                          </Box>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1!">
                          (02) Identificatorul unic al unităţii vinicole
                        </td>
                        <td>
                          <Box
                            sx={{
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {isEditing ? (
                              <>
                                <TextField
                                  fullWidth
                                  id="identificatorUnicUnitateVinicola"
                                  size="small"
                                  {...register(
                                    "identificatorUnicUnitateVinicola",
                                  )}
                                />
                              </>
                            ) : (
                              <Completed>
                                {identificatorUnicUnitateVinicola}
                              </Completed>
                            )}

                            {errors?.identificatorUnicUnitateVinicola
                              ?.message && (
                              <Typography
                                variant="body2"
                                color="error"
                                className="mt-1"
                              >
                                {
                                  errors?.identificatorUnicUnitateVinicola
                                    ?.message
                                }
                              </Typography>
                            )}
                          </Box>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Stack>

                <Stack>
                  <table className="anexa7 table-auto border-collapse border border-gray-500">
                    <thead>
                      <tr>
                        <th
                          colSpan={7}
                          style={{
                            textAlign: "left",
                            fontWeight: 700,
                            fontSize: "18px",
                          }}
                        >
                          A. Date privind unitatea vinicolă/comerciantul cu
                          ridicata:
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={3} style={{ textAlign: "left" }}>
                          (03) Denumirea persoanei juridice / numele, prenumele
                          persoanei fizice
                        </th>
                        <th colSpan={4} style={{ textAlign: "left" }}>
                          (04) IDNO/IDNP
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={3}>&nbsp;</th>
                        <th colSpan={4}>&nbsp;</th>
                      </tr>
                      <tr>
                        <th colSpan={3}>
                          <Box
                            sx={{
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {isEditing ? (
                              <>
                                <div className="hidden">
                                  <FormControl>
                                    <TextField
                                      id={formData?.id as Anexa7Data["id"]}
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

                            {errors?.declarant?.name?.message && (
                              <Typography
                                variant="body2"
                                color="error"
                                className="mt-1"
                              >
                                {errors?.declarant?.name?.message}
                              </Typography>
                            )}
                          </Box>
                        </th>
                        <th colSpan={4}>
                          <Box
                            sx={{
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {isEditing ? (
                              <>
                                <TextField
                                  fullWidth
                                  id="idno_idnp"
                                  size="small"
                                  {...register("declarant.idno_idnp")}
                                />
                              </>
                            ) : (
                              <Completed>{declarant?.idno_idnp}</Completed>
                            )}

                            {errors?.declarant?.idno_idnp?.message && (
                              <Typography
                                variant="body2"
                                color="error"
                                className="mt-1"
                              >
                                {errors?.declarant?.idno_idnp?.message}
                              </Typography>
                            )}
                          </Box>
                        </th>
                      </tr>
                      <tr>
                        <th
                          colSpan={7}
                          style={{
                            textAlign: "left",
                            fontWeight: 700,
                            fontSize: "18px",
                          }}
                        >
                          H. Declaraţie de stoc:
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan={2}>
                          (05) Categoria produsului vitivinicol
                        </th>
                        <th rowSpan={2}>(06) Denumirea produsului vinicol</th>
                        <th rowSpan={2}>(07) unitatea de măsură</th>
                        <th colSpan={4}>
                          (08) Stocurile de produse, după culoare:
                        </th>
                      </tr>
                      <tr>
                        <th>(09) total</th>
                        <th>(10) roşu</th>
                        <th>(11) roz</th>
                        <th>(12) alb</th>
                      </tr>
                    </thead>

                    <tbody>
                      {CATEGORIES.map(({ categoryName, title }, index) => (
                        <Fragment key={`${categoryName}-${index}`}>
                          <tr>
                            <td
                              rowSpan={
                                stockProductsByCategories[categoryName]
                                  ?.length || 1
                              }
                              style={{
                                textAlign: "center",
                                verticalAlign: "top",
                              }}
                            >
                              <Stack
                                direction="row"
                                sx={{
                                  alignItems: "center",
                                }}
                              >
                                <Typography sx={{ flex: 1 }}>
                                  {title}
                                </Typography>

                                {isEditing &&
                                  canAddStockProduct(categoryName) && (
                                    <IconButton
                                      onClick={() =>
                                        handleAddStockProduct(categoryName)
                                      }
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

                            {stockProductsByCategories[categoryName]?.length ===
                              0 && (
                              <>
                                <td></td>
                                <td
                                  rowSpan={
                                    stockProductsByCategories[categoryName]
                                      ?.length || 1
                                  }
                                  style={{
                                    textAlign: "center",
                                    verticalAlign: "top",
                                  }}
                                >
                                  {categoryName ===
                                  StockProductCategory.BULK_WINE
                                    ? "dal"
                                    : StockProductCategory.BOTTLED_WINE
                                      ? "sticle"
                                      : ""}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </>
                            )}

                            {stockProductsByCategories[categoryName]
                              .slice(0, 1)
                              .map(
                                (
                                  {
                                    id,
                                    category = "",
                                    externalId = "",
                                    name = "",
                                    unit = "",
                                    total = "",
                                    red = "",
                                    rose = "",
                                    white = "",
                                  },
                                  index,
                                ) => (
                                  <Fragment
                                    key={`${externalId}-${category}-${name}-${index}`}
                                  >
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
                                              noOptionsText="No products available"
                                              options={productsByCategories[
                                                categoryName
                                              ]
                                                .filter(
                                                  ({ id }) =>
                                                    !formData?.stockProducts?.some(
                                                      ({
                                                        externalId,
                                                        category,
                                                      }) =>
                                                        externalId === id &&
                                                        categoryName ===
                                                          category,
                                                    ),
                                                )
                                                .map(({ id, name, total }) => ({
                                                  id,
                                                  name,
                                                  total,
                                                }))}
                                              value={{
                                                id,
                                                name,
                                                total: total as number,
                                              }}
                                              getOptionLabel={(option) =>
                                                option.name
                                              }
                                              filterSelectedOptions
                                              onChange={(_event, product) => {
                                                if (!product) return;

                                                const existingProduct =
                                                  Array.isArray(
                                                    formData?.stockProducts,
                                                  )
                                                    ? formData?.stockProducts?.find(
                                                        ({
                                                          externalId = "",
                                                          name = "",
                                                          category = "",
                                                        }) =>
                                                          ((externalId !== "" &&
                                                            externalId ===
                                                              product?.id) ||
                                                            (name !== "" &&
                                                              name ===
                                                                product?.name)) &&
                                                          category ===
                                                            categoryName,
                                                      )
                                                    : undefined;

                                                if (existingProduct) return;

                                                const existing = Array.isArray(
                                                  formData?.stockProducts,
                                                )
                                                  ? formData?.stockProducts?.find(
                                                      ({
                                                        externalId = "",
                                                        name = "",
                                                      }) =>
                                                        (externalId !== "" &&
                                                          externalId ===
                                                            product?.id) ||
                                                        (name !== "" &&
                                                          name ===
                                                            product?.name),
                                                    )
                                                  : undefined;

                                                const updated =
                                                  formData?.stockProducts?.map(
                                                    (product2) => ({
                                                      ...product2,
                                                      ...(product2.id ===
                                                        id && {
                                                        externalId: product.id,
                                                        name:
                                                          product.name || "",
                                                        total:
                                                          existing?.total ||
                                                          product?.total ||
                                                          "",
                                                        red:
                                                          existing?.red || "",
                                                        rose:
                                                          existing?.rose || "",
                                                        white:
                                                          existing?.white || "",
                                                      }),
                                                    }),
                                                  );

                                                handleChange(
                                                  "stockProducts",
                                                  updated,
                                                );
                                              }}
                                              sx={{ flex: 1 }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  fullWidth
                                                  size="small"
                                                />
                                              )}
                                            />

                                            <IconButton
                                              onClick={() =>
                                                handleRemoveStockProduct(id)
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

                                    <td
                                      rowSpan={
                                        stockProductsByCategories[categoryName]
                                          ?.length || 1
                                      }
                                      style={{
                                        textAlign: "center",
                                        verticalAlign: "top",
                                      }}
                                    >
                                      {categoryName ===
                                      StockProductCategory.BULK_WINE
                                        ? "dal"
                                        : StockProductCategory.BOTTLED_WINE
                                          ? "sticle"
                                          : ""}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="total"
                                          value={total || ""}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "total",
                                              e.target.value,
                                            )
                                          }
                                          sx={{
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <Completed>{total || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="red"
                                          value={red || ""}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "red",
                                              e.target.value,
                                            )
                                          }
                                          sx={{
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <Completed>{red || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="rose"
                                          value={rose || ""}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "rose",
                                              e.target.value,
                                              categoryName,
                                            )
                                          }
                                        />
                                      ) : (
                                        <Completed>{rose || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="white"
                                          value={white || ""}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "white",
                                              e.target.value,
                                              categoryName,
                                            )
                                          }
                                        />
                                      ) : (
                                        <Completed>{white || ""}</Completed>
                                      )}
                                    </td>
                                  </Fragment>
                                ),
                              )}
                          </tr>

                          {stockProductsByCategories[categoryName]
                            .slice(1)
                            .map(
                              (
                                {
                                  id,
                                  category = "",
                                  externalId = "",
                                  name = "",
                                  unit = "",
                                  total = "",
                                  red = "",
                                  rose = "",
                                  white = "",
                                },
                                index,
                              ) => (
                                <Fragment
                                  key={`${externalId}-${category}-${name}-${index}`}
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
                                        <span>&nbsp;{index + 2}.&nbsp;</span>

                                        {isEditing ? (
                                          <>
                                            <Autocomplete
                                              noOptionsText="No products available"
                                              options={productsByCategories[
                                                categoryName
                                              ]
                                                .filter(
                                                  ({ id }) =>
                                                    !formData?.stockProducts?.some(
                                                      ({
                                                        externalId,
                                                        category,
                                                      }) =>
                                                        externalId === id &&
                                                        categoryName ===
                                                          category,
                                                    ),
                                                )
                                                .map(({ id, name, total }) => ({
                                                  id,
                                                  name,
                                                  total,
                                                }))}
                                              value={{
                                                id,
                                                name,
                                                total: total as number,
                                              }}
                                              getOptionLabel={(option) =>
                                                option.name
                                              }
                                              filterSelectedOptions
                                              onChange={(_event, product) => {
                                                if (!product) return;

                                                const existingProduct =
                                                  Array.isArray(
                                                    formData?.stockProducts,
                                                  )
                                                    ? formData?.stockProducts?.find(
                                                        ({
                                                          externalId = "",
                                                          name = "",
                                                          category = "",
                                                        }) =>
                                                          ((externalId !== "" &&
                                                            externalId ===
                                                              product?.id) ||
                                                            (name !== "" &&
                                                              name ===
                                                                product?.name)) &&
                                                          category ===
                                                            categoryName,
                                                      )
                                                    : undefined;

                                                if (existingProduct) return;

                                                const existing = Array.isArray(
                                                  formData?.stockProducts,
                                                )
                                                  ? formData?.stockProducts?.find(
                                                      ({
                                                        externalId = "",
                                                        name = "",
                                                      }) =>
                                                        (externalId !== "" &&
                                                          externalId ===
                                                            product?.id) ||
                                                        (name !== "" &&
                                                          name ===
                                                            product?.name),
                                                    )
                                                  : undefined;

                                                const updated =
                                                  formData?.stockProducts?.map(
                                                    (product2) => ({
                                                      ...product2,
                                                      ...(product2.id ===
                                                        id && {
                                                        externalId: product.id,
                                                        name:
                                                          product.name || "",
                                                        total:
                                                          existing?.total ||
                                                          product?.total ||
                                                          "",
                                                        red:
                                                          existing?.red || "",
                                                        rose:
                                                          existing?.rose || "",
                                                        white:
                                                          existing?.white || "",
                                                      }),
                                                    }),
                                                  );

                                                handleChange(
                                                  "stockProducts",
                                                  updated,
                                                );
                                              }}
                                              sx={{ flex: 1 }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  fullWidth
                                                  size="small"
                                                />
                                              )}
                                            />

                                            <IconButton
                                              onClick={() =>
                                                handleRemoveStockProduct(id)
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
                                          name="total"
                                          value={total}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "total",
                                              e.target.value,
                                            )
                                          }
                                          sx={{
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <Completed>{total || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="red"
                                          value={red}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "red",
                                              e.target.value,
                                            )
                                          }
                                          sx={{
                                            width: "100%",
                                          }}
                                        />
                                      ) : (
                                        <Completed>{red || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="rose"
                                          value={rose}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "rose",
                                              e.target.value,
                                              categoryName,
                                            )
                                          }
                                        />
                                      ) : (
                                        <Completed>{rose || ""}</Completed>
                                      )}
                                    </td>

                                    <td style={editableCellStyle(isEditing)}>
                                      {isEditing ? (
                                        <EditableQty
                                          name="white"
                                          value={white}
                                          onChange={(e) =>
                                            handleStockProductChange(
                                              externalId,
                                              "white",
                                              e.target.value,
                                              categoryName,
                                            )
                                          }
                                        />
                                      ) : (
                                        <Completed>{white || ""}</Completed>
                                      )}
                                    </td>
                                  </tr>
                                </Fragment>
                              ),
                            )}
                        </Fragment>
                      ))}

                      {Array.isArray(errors?.stockProducts) &&
                        (errors?.stockProducts?.slice(-1)?.[0]?.externalId
                          ?.message ||
                          errors?.stockProducts?.slice(-1)?.[0]?.name
                            ?.message ||
                          errors?.stockProducts?.slice(-1)?.[0]?.total
                            ?.message ||
                          errors?.stockProducts?.slice(-1)?.[0]?.red?.message ||
                          errors?.stockProducts?.slice(-1)?.[0]?.rose
                            ?.message ||
                          errors?.stockProducts?.slice(-1)?.[0]?.white
                            ?.message) && (
                          <tr>
                            <td></td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {errors?.stockProducts?.slice(-1)?.[0]?.externalId
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]
                                      ?.externalId?.message
                                  }
                                </Typography>
                              )}

                              {errors?.stockProducts?.slice(-1)?.[0]?.name
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]?.name
                                      ?.message
                                  }
                                </Typography>
                              )}
                            </td>
                            <td></td>
                            <td
                              colSpan={4}
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {errors?.stockProducts?.slice(-1)?.[0]?.total
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]?.total
                                      ?.message
                                  }
                                </Typography>
                              )}

                              {errors?.stockProducts?.slice(-1)?.[0]?.red
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]?.red
                                      ?.message
                                  }
                                </Typography>
                              )}

                              {errors?.stockProducts?.slice(-1)?.[0]?.rose
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]?.rose
                                      ?.message
                                  }
                                </Typography>
                              )}

                              {errors?.stockProducts?.slice(-1)?.[0]?.white
                                ?.message && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  className="mt-1"
                                >
                                  {
                                    errors?.stockProducts?.slice(-1)?.[0]?.white
                                      ?.message
                                  }
                                </Typography>
                              )}
                            </td>
                          </tr>
                        )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colSpan={7}>
                          <Typography>
                            <strong>Declaraţie:</strong> Subsemnatul
                            <Box
                              component="span"
                              sx={{
                                mx: 1,
                                display: "inline-block",
                                width: "240px",
                                borderBottom:
                                  "1px dotted var(--reports-table-border-color)",
                              }}
                            >
                              &nbsp;
                            </Box>
                            sînt informat şi sînt de acord că datele cu caracter
                            personal furnizate vor fi prelucrate de către
                            registratorul/subregistratorul
                            <Box
                              component="span"
                              sx={{
                                mx: 1,
                                display: "inline-block",
                                width: "100px",
                                borderBottom:
                                  "1px dotted var(--reports-table-border-color)",
                              }}
                            >
                              &nbsp;
                            </Box>
                            ONVV
                            <Box
                              component="span"
                              sx={{
                                mx: 1,
                                display: "inline-block",
                                width: "100px",
                                borderBottom:
                                  "1px dotted var(--reports-table-border-color)",
                              }}
                            >
                              &nbsp;
                            </Box>
                            în scopul asigurării trasabilității produselor
                            vitivinicole cu respectarea regimului de securitate
                            şi confidențialitate, în conformitate cu prevederile
                            Legii nr. 133 din 8 iulie 2011 privind protecția
                            datelor cu caracter personal. Sub sancţiunile
                            aplicate faptei de fals în acte publice, declar pe
                            propria răspundere că datele indicate în Cererea
                            privind înregistrarea/modificarea în Registrul
                            vitivinicol sînt veridice și complete, iar
                            informația furnizată nu va folosită în scopuri
                            incompatibile sau remisă fără temei terților
                            neautorizați. Conștientizez că anumite categorii de
                            date cu caracter personal furnizate, şi anume
                            numele/prenumele, datele de contact şi adresa, vor
                            fi făcute publice prin intermediul paginii web
                            oficiale a Oficiului Naţional al Viei şi Vinului,
                            avînd în vedere scopul de a asigura trasabilitatea
                            produselor vitivinicole.
                          </Typography>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
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
                  <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                    Data prezentării declaraţiei
                  </Typography>

                  <Box
                    sx={{
                      width: "100px",
                      textAlign: "center",
                      borderBottom: isEditing
                        ? ""
                        : "1px solid var(--reports-table-border-color)",
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
                              : undefined,
                          )
                        }
                      />
                    ) : (
                      <Completed>{date && formatDate(date)}</Completed>
                    )}
                  </Box>
                </Stack>

                {errors?.date?.message && (
                  <Typography variant="body2" color="error" className="mt-1">
                    {errors?.date?.message}
                  </Typography>
                )}

                <Stack
                  className="print-style"
                  sx={{
                    flexDirection: "row",
                    mt: 3,
                    fontSize: "16px",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Stack
                    sx={{
                      width: "50%",
                      flexDirection: "row",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography sx={{ flex: 0, whiteSpace: "nowrap" }}>
                      Declarantul (numele, prenumele) /
                    </Typography>

                    <Box
                      sx={{
                        width: "50%",
                        textAlign: "center",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <TextField
                            fullWidth
                            id="name2"
                            size="small"
                            {...register("declarant.name2")}
                          />
                        </>
                      ) : (
                        <Completed>{declarant?.name2}</Completed>
                      )}

                      {errors?.declarant?.name2?.message && (
                        <Typography
                          variant="body2"
                          color="error"
                          className="mt-1"
                        >
                          {errors?.declarant?.name2?.message}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ px: 2, flex: 0, whiteSpace: "nowrap" }}>
                      /
                    </Typography>
                  </Stack>

                  <Stack
                    sx={{
                      width: "50%",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography sx={{ px: 4, flex: 0, whiteSpace: "nowrap" }}>
                      L.Ş.
                    </Typography>

                    <Stack sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "200px",
                          borderBottom:
                            "1px solid var(--reports-table-border-color)",
                        }}
                      >
                        &nbsp;
                      </Box>
                      <Typography sx={{ fontSize: "14px" }}>
                        semnătura
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
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
