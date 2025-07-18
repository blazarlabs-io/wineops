/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GrapeDestination,
  ParcelClassification,
  ReducedVineyard,
  StockProductCategory,
} from "@/models/types/reports";
import {
  Typography as MuiTypography,
  TypographyProps,
  styled,
  TextField as Input,
  FormControl,
  CSSProperties,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ChangeEventHandler, ReactNode } from "react";

const typoProps: TypographyProps = {
  fontSize: "inherit",
  fontFamily: "inherit",
  fontWeight: "inherit",
  lineHeight: 1.1,
};

export const CATEGORIES: Array<{
  categoryName: StockProductCategory;
  title: ReactNode;
}> = [
  {
    categoryName: StockProductCategory.BULK_WINE,
    title: (
      <>
        <strong>Vin în Vrac</strong>
      </>
    ),
  },
  {
    categoryName: StockProductCategory.BOTTLED_WINE,
    title: (
      <>
        <strong>Vin Îmbuteliat</strong>
      </>
    ),
  },
];

export const Typography = (props: TypographyProps) => (
  <MuiTypography {...typoProps} {...props} />
);

export const Completed = ({
  sx,
  children,
}: {
  sx?: TypographyProps;
  children: ReactNode;
}) => (
  <MuiTypography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1, ...sx }}>
    {children}
  </MuiTypography>
);

export const EditableQty = ({
  name,
  value,
  onChange,
  sx,
}: {
  name: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  sx?: CSSProperties;
}) => (
  <FormControl sx={sx}>
    <TextField
      id={name}
      size="small"
      label=""
      type={name === "name" ? "text" : "number"}
      value={value}
      {...(name !== "name" && {
        slotProps: {
          htmlInput: {
            min: 0,
            step: 0.1,
            max: 1_000_000,
          },
        },
      })}
      sx={{
        width: "50px",
        alignSelf: "self-end",
        ...sx,
      }}
      onChange={onChange}
    />
  </FormControl>
);

export const editableCellStyle = (isEditing: boolean): CSSProperties => ({
  textAlign: "center",
  ...(isEditing && {
    minWidth: "50px",
    verticalAlign: "bottom",
  }),
});

export const TextField = styled(Input)(({ theme: { palette } }) => ({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInputBase-input": {
    textAlign: "center",
    border: "none",
    padding: "1px",
    margin: "0px",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    //height: "12px",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "none",
    border: "none",
  },
  "& .MuiOutlinedInput-root": {
    padding: "0px",
    "& fieldset": {
      borderRadius: "0px",
      borderColor: "var(--mui-palette-primary-main)",
      borderWidth: "0px",
      borderBottomWidth: "1px !important",
    },
    "&:hover fieldset": {
      borderColor: palette.primary.main,
      borderWidth: "0px",
      borderBottomWidth: "2px !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: palette.primary.main,
      borderWidth: "0px",
      borderBottomWidth: "2px !important",
    },
  },
}));

export const StyledDatePicker = styled(DatePicker)(
  ({ theme: { palette } }) => ({
    "& .MuiPickersSectionList-root": {
      padding: "0px",
      margin: "0px",
      width: "100px",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#A0AAB4",
    },

    "& .MuiInputBase-input, .MuiPickersInputBase-root": {
      textAlign: "center",
      border: "none",
      padding: "1px",
      margin: "0px 0px 0px 8px",
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1,
      //height: "12px",
      "&:focus": {
        outline: "none",
      },
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "none",
      border: "none",
    },

    "& .MuiOutlinedInput-root, .MuiPickersInputBase-root": {
      "& fieldset": {
        borderRadius: "0px",
        borderColor: "var(--mui-palette-success-main)",
        borderWidth: "0px",
        borderBottomWidth: "2px !important",
      },
      "&:hover fieldset": {
        borderColor: palette.primary.main,
        borderWidth: "0px",
        borderBottomWidth: "2px !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: palette.primary.main,
        borderWidth: "0px",
        borderBottomWidth: "2px !important",
      },
    },
    "& .MuiInputAdornment-root": {
      marginLeft: "0px",
    },
    "& .MuiSvgIcon-root": {
      width: "16px",
      height: "16px",
      margin: "0px",
    },
  })
);

export const generateEmptyRows = (numberOfRows = 1) =>
  Array.from({ length: numberOfRows }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 17 }).map((_, indexCell) => (
        <td key={indexCell}>
          &nbsp;{indexCell === 0 ? `${index + 1}.` : ""}&nbsp;
        </td>
      ))}
    </tr>
  ));

export const generateEmptyCells = (numberOfCells = 1) =>
  Array.from({ length: numberOfCells }).map((_, index) => (
    <td key={index}>&nbsp;</td>
  ));

export const filterByCategory = (
  arr: any[],
  productCategory: StockProductCategory
) =>
  Array.isArray(arr)
    ? arr.filter(({ category }) => category === productCategory)
    : [];

export const getVineyardBatchesQty = (batches: any[], grapes: any[]): number =>
  batches.length > 0 && grapes?.length > 0
    ? grapes
        .filter((grape) => batches.some((batch) => batch?.id === grape?.id))
        .reduce((sum: number, { metrics }) => (sum += metrics?.actual || 0), 0)
    : 0;
