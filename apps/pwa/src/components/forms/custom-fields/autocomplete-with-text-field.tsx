/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bottle, Chemistry, ChemistryType } from "@/models/types/db";
import {
  InputLabel,
  FormControl,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

type LocalEntity = Chemistry | Bottle;

export type AutocompleteWithTextFieldProps = {
  title?: string | null;
  key: any;
  label: any;
  value?: any;
  errors: any;
  options: any;
  onValueChange: (name: any, value: any) => void;
  onTextChange: (name: any, value: any) => void;
};

export default function AutocompleteWithTextField({
  title = null,
  label,
  key,
  errors,
  value,
  options,
  onValueChange,
  onTextChange,
}: AutocompleteWithTextFieldProps) {
  const handleSelectChange = useCallback(
    (name: keyof LocalEntity, value: LocalEntity[keyof LocalEntity]) => {
      onValueChange(name, value);
    },
    [onValueChange]
  );

  const handleInputChange = useCallback(
    (name: any, value: string) => {
      onTextChange(name, value);
    },
    [onTextChange]
  );

  console.log("AAAAAAA", value);
  return (
    <div className="flex flex-col gap-2 w-full">
      {title && (
        <InputLabel className="text-sm text-muted-foreground">
          {title}
        </InputLabel>
      )}

      <FormControl>
        <Autocomplete
          freeSolo
          options={Object.values(options)}
          value={value}
          //   getOptionLabel={(option) => option.name }
          filterSelectedOptions
          onChange={(_event, newValue) => {
            console.log("newValue", newValue);
            handleSelectChange(key, newValue as LocalEntity[keyof LocalEntity]);
          }}
          onInputChange={(_event, newInputValue) => {
            handleInputChange("subjectRecipe", newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label={label} variant="outlined" />
          )}
        />
      </FormControl>
      {errors?.type && (
        <Typography variant="body2" color="error" className="mt-1">
          {errors?.type?.message as string}
        </Typography>
      )}
    </div>
  );
}
