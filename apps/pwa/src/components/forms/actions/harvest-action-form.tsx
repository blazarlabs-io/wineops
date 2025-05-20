/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardHarvestActionSample } from "@/data/actions-samples";
import { useAuth } from "@/lib/firebase/auth";
import { vineyardHarvestActionSchema } from "@/models/schemas/actions/vineyard-harvest-action-schema";
import { VineyardHarvestAction } from "@/models/types/actions";
import { DbResponse, Vineyard, VineyardStatus } from "@/models/types/db";
import { joiResolver } from "@hookform/resolvers/joi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  TextField as Input,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { generateDummyDocs, generateLabData } from "@/utils/generators";
import { db } from "@/lib/firebase/services";

export type HarvestActionFormProps = {
  vineyards: Vineyard[];
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function HarvestActionForm({
  vineyards,
}: HarvestActionFormProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    // getValues,
    // setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(vineyardHarvestActionSchema),
  });

  // vineyardBlankSample.id = Date.now().toString();
  const [formData, setFormData] = useState<VineyardHarvestAction>(
    vineyardHarvestActionSample
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    // * here we call the selected vineyards in their DB and update their status to Harvest
    // db.vineyard.updateStatus(user?.uid || "", data.subject, "harvest");
    formData.subject.map((vineyard) => {
      db.vineyard
        .update(user?.uid, vineyard.id, { status: VineyardStatus.HARVESTING })
        .then((res: DbResponse) => {
          console.log(res);
          enqueueSnackbar("Vineyard status updated", { variant: "success" });
        })
        .catch((error: DbResponse) => {
          console.error(error);
          enqueueSnackbar("Vineyard status update failed", {
            variant: "error",
          });
        });
      console.log(vineyard);
    });

    setFormData(data);
  };

  useEffect(() => {
    if (vineyards && vineyards.length > 0) {
      vineyardHarvestActionSample.id = `action-${new Date().toString()}`;
      vineyardHarvestActionSample.subject = vineyards.map((v) => {
        return { name: v.name, id: v.id };
      });
      vineyardHarvestActionSample.executionDate = new Date();
      vineyardHarvestActionSample.consumables = [];
      vineyardHarvestActionSample.batchId = new Date().toString();
      vineyardHarvestActionSample.quantity = {
        actual: 0,
        supply: 0,
        demand: 0,
        status: "",
      };
      vineyardHarvestActionSample.invoiceNumber = `invoice-${new Date().toString()}`;
      vineyardHarvestActionSample.latestLabData = generateLabData()[0];
      vineyardHarvestActionSample.vessels = [];
      vineyardHarvestActionSample.equipment = [];
      vineyardHarvestActionSample.description = "description goes here";
      vineyardHarvestActionSample.location = "Argentina";
      vineyardHarvestActionSample.documents = generateDummyDocs(10);

      reset(vineyardHarvestActionSample);

      setFormData(vineyardHarvestActionSample);
    }
  }, [vineyards]);

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
                {/* * ACTION SUBJECT */}
                <div className="flex flex-col w-full">
                  {/* <Label htmlFor="name">Vineyard Name</Label> */}
                  <InputLabel className="text-sm">
                    To which item the Action applies to.
                  </InputLabel>
                  <div className="flex flex-wrap items-center justify-start gap-2 pt-2">
                    {formData.subject &&
                      formData.subject.length > 0 &&
                      formData.subject.map((vineyard) => (
                        <div key={vineyard.id} className="">
                          <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            label={vineyard.name}
                          />
                        </div>
                      ))}
                  </div>
                  {/* <DemoItem label="DatePicker"> */}
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <div className="w-full mt-8">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          // defaultValue={new Date()}
                          disablePast
                          views={["year", "month", "day"]}
                          className="w-full"
                        />
                      </LocalizationProvider>
                    </div>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Consumables
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Consumables"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Batch ID
                      </InputLabel>
                      <TextField
                        id="outlined-basic"
                        label="Batch ID"
                        variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Quantity Kg
                      </InputLabel>
                      <TextField
                        type="number"
                        id="outlined-basic"
                        label="Quantity Kg"
                        variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Invoice No.
                      </InputLabel>
                      <TextField
                        type="text"
                        id="outlined-basic"
                        label="Invoice No."
                        variant="outlined"
                      />
                    </FormControl>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      size="large"
                      tabIndex={-1}
                      startIcon={<CloudUpload />}
                    >
                      Upload lab report
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                        multiple
                      />
                    </Button>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Vessels
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Vessels"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Equipment
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Equipment"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Description
                      </InputLabel>
                      <TextField
                        type="text"
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Location
                      </InputLabel>
                      <TextField
                        type="text"
                        id="outlined-basic"
                        label="Location"
                        variant="outlined"
                      />
                    </FormControl>
                  </Box>
                </div>
              </div>
            </div>

            <Box display={"flex"} justifyContent={"end"}>
              <FormControl>
                <Button type="submit" variant="contained" className="mt-8">
                  Set
                </Button>
              </FormControl>
            </Box>
          </form>
        </div>
      )}
    </>
  );
}
