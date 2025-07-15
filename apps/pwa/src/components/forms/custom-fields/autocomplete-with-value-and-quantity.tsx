/* eslint-disable @typescript-eslint/no-explicit-any */
import { VineyardGlobalAction } from "@/models/types/actions";
import { Chemistry, Consumable } from "@/models/types/db";
import {
  InputLabel,
  Autocomplete,
  TextField,
  Stack,
  Typography,
  FormControl,
  Input,
  IconButton,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { Fragment, useEffect, useState } from "react";

export type AutocompleteWithValueAndQuantityProps = {
  label: string;
  title: string;
  items: Consumable[] | Chemistry[];
  currentItems: any[];
  onChange: (name: string, value: any) => void;
  handleQtyChange: (index: number, value: any) => void;
  handleDelete: (value: string, index: number) => void;
  errors: any;
};

export type ItemType = {
  id: string;
  name: string;
  qty: number;
};

export default function AutoCompleteWithValueAndQuantityField({
  label,
  title,
  items,
  currentItems,
  onChange,
  handleQtyChange,
  handleDelete,
  errors,
}: AutocompleteWithValueAndQuantityProps) {
  const itemKey = label as keyof VineyardGlobalAction;
  const [localItems, setLocalItems] = useState<ItemType[]>([]);
  //   const [localCurrentItems, setLocalCurrentItems] = useState<ItemType[]>([]);

  useEffect(() => {
    if (items && label) {
      if (label === "consumables") {
        setLocalItems(
          (items as Consumable[]).map((v) => ({
            id: v.consumableID ?? "",
            name: v.name ?? "",
            qty: v.qty ?? 0,
          }))
        );
      } else if (label === "chemistry") {
        setLocalItems(
          (items as Chemistry[]).map((v) => ({
            id: v.chemistryID ?? "",
            name: v.name ?? "",
            qty: v.qty ?? 0,
          }))
        );
      }
    }
  }, [items, label]);

  return (
    <div className="flex flex-col gap-2">
      <InputLabel className="text-sm! text-muted-foreground">
        {title}
      </InputLabel>

      <Autocomplete
        multiple
        noOptionsText={`No ${label} found`}
        getOptionLabel={(option) => option || ""}
        options={
          localItems && localItems !== undefined
            ? localItems?.map((v) => v.id)
            : []
        }
        value={[]}
        filterSelectedOptions
        onChange={(_event, newValue) => {
          onChange(label, newValue);
        }}
        renderInput={(params) => (
          <>
            {params && (
              <TextField
                {...params}
                variant="outlined"
                label={`${label.charAt(0).toUpperCase() + label.slice(1)} used`}
              />
            )}
          </>
        )}
      />

      {currentItems && currentItems.length > 0 && (
        <Stack
          p={2}
          pb={1}
          gap={1}
          sx={{
            border: "1px solid var(--mui-palette-divider)",
          }}
        >
          {currentItems &&
            currentItems?.map((item: any, index: number) => (
              <Fragment key={item.id + item.name}>
                <Stack
                  gap={1}
                  key={item.id}
                  direction="row"
                  alignItems="center"
                >
                  <Typography variant="body2" component="div" sx={{ flex: 1 }}>
                    {item.id}
                  </Typography>

                  <FormControl>
                    <Input
                      id="qty"
                      size="small"
                      // label="Qty"
                      type="number"
                      // variant="outlined"
                      value={item.qty || 0}
                      inputProps={{
                        min: 1,
                        step: "any",
                      }}
                      sx={{ width: "80px" }}
                      onChange={(e) => {
                        handleQtyChange(index, Number(e.target.value));
                      }}
                    />
                  </FormControl>

                  <IconButton
                    size="small"
                    disabled={false}
                    onClick={() => {
                      handleDelete(label, index);
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
                  {errors?.[itemKey] &&
                    Array.isArray(errors?.[itemKey]) &&
                    (errors?.[itemKey][index]?.qty?.message as string)}
                </Typography>
              </Fragment>
            ))}
        </Stack>
      )}

      {errors?.[itemKey] && (
        <Typography variant="body2" color="error" className="mt-1">
          {errors?.[itemKey]?.message as string}
        </Typography>
      )}
    </div>
  );
}

/* <div className="flex flex-col gap-2">
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

    {(formData.[itemKey] || []).length > 0 && (
    <Stack
        p={2}
        pb={1}
        gap={1}
        sx={{
        border: "1px solid var(--mui-palette-divider)",
        }}
    >
        {formData.[itemKey]?.map(
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
                        [...(formData.[itemKey] || [])];
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
</div> */
