/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { vineyardGlobalActionSample } from "@/data/actions-samples";
import { VineyardGlobalAction } from "@/models/types/actions";
import { joiResolver } from "@hookform/resolvers/joi";

import { useVineyard } from "@/context/vineyard";
import { useWinery } from "@/context/winery";
import { setNestedValue } from "@/helpers/form-helpers";
import { useGetVineyardsNames } from "@/hooks/use-get-vineyards-names";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { vineyardGlobalActionSchema } from "@/models/schemas/actions/vineyard-global-action-schema";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { BackupOutlined, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  TextField as Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { File } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsibleTeamMemberField from "../../custom-fields/responsible-team-member-field";

export default function VineyardLabActionForm() {
  const { vineyards, actions } = useVineyard();

  const selectedVineyards = useSelectedEntitiesStore(
    ({ selected }) => selected
  );

  const { teamMembers } = useWinery();
  const { user } = useAuth();
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
  const [disableSubject, setDisableSubject] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (name.startsWith("executionDate")) {
        // value = Timestamp.fromDate(value.toDate());
        value = new Date(value).toDateString();
      }

      if (name === "inUseVineyard.name") {
        //value = Timestamp.fromDate(value.toDate());
        setValue(
          "inUseVineyard.id" as string,
          vineyards.filter((v) => v?.name === value)[0]?.id as string
        );
        setValue("inUseVineyard.name" as string, value as any);
      } else {
        setValue(name as string, value as any);
      }

      if (name === "responsible.name") {
        setValue(
          "responsible.email" as string,
          teamMembers.filter((tm) => tm?.name === value)[0]?.email as any
        );
        setValue("responsible.name" as string, value as any);
      }

      const path = name.split(".");
      const newFormData = setNestedValue(formData, path, value);

      setFormData(newFormData);
    },
    [formData, setValue]
  );

  const handleInUseVineyardChange = useCallback(
    (value: any) => {
      const subjectVineyard = vineyards.filter((v) => v.name === value)[0];
      console.log("value", value, subjectVineyard);
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        inUseVineyard: {
          id: subjectVineyard?.id,
          name: subjectVineyard?.name,
        },
      }));
      setValue("inUseVineyard", {
        id: subjectVineyard?.id,
        name: subjectVineyard?.name,
      });
    },

    [setValue, vineyards]
  );

  const handleNewUpload = useCallback(
    (name: string, url: string, file: File) => {
      const filesUrls = formData.supportingDocuments;
      filesUrls?.push({
        name: file.name,
        url: url,
      });
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        supportingDocuments: filesUrls,
      }));
      setValue(name, filesUrls);
    },
    [formData.supportingDocuments, setValue]
  );

  const handleFile = useCallback((e: any) => {
    const file = e.target.files[0];
    console.log(file);
    // TODO: upload file and show upload progress...
    db.storage.uploadFile(
      file,
      user?.uid,
      "labResults",
      (progress: number) => {
        setIsUploading(true);
        setUploadProgress(progress);
      },
      (complete: string) => {
        setIsUploading(false);
        setUploadProgress(0);
        console.log(complete);
        handleNewUpload("supportingDocuments", complete, file);
      },
      (error: Error) => {
        setIsUploading(false);
        setUploadProgress(0);
        console.log(error);
      }
    );
  }, []);

  const handleDeleteFile = useCallback(
    async (name: string, index: number) => {
      const filesUrls = formData.supportingDocuments;
      filesUrls?.splice(index, 1);
      setFormData((prev) => ({
        ...(prev as VineyardGlobalAction),
        supportingDocuments: filesUrls,
      }));
      setValue(name, filesUrls);

      const deleteFileRes = await db.storage.deleteFile(
        user?.uid,
        "labResults",
        name
      );

      if (deleteFileRes.status == 200) {
        console.log("File deleted");
      } else {
        console.log("Error deleting file");
      }
    },
    [formData.supportingDocuments, setValue]
  );

  const onSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("SUBMIT", data);
    console.log("ERRORS:", errors);

    const subjectVineyard = vineyards.filter(
      (v) => v.id === data.inUseVineyard.id
    )[0];

    actions?.["lab-report"].exec(user?.uid as string, data, subjectVineyard);

    setFormData(data);
  };

  useEffect(() => {
    vineyardGlobalActionSample.id = Date.now().toString();
    vineyardGlobalActionSample.type = "lab-report";
    vineyardGlobalActionSample.executionDate = new Date().toDateString();
    if (
      vineyardGlobalActionSample.responsible !== undefined &&
      teamMembers &&
      teamMembers.length > 0
    ) {
      vineyardGlobalActionSample.responsible.name = ""; //teamMembers[0]?.name;
      vineyardGlobalActionSample.responsible.email = ""; //teamMembers[0]?.email;
    }

    // * If there is only one vineyard selected, else use the first vineyard is any
    if (selectedVineyards && selectedVineyards.length === 1) {
      setDisableSubject(true);
      vineyardGlobalActionSample.inUseVineyard = {
        id: selectedVineyards[0]?.id,
        name: selectedVineyards[0]?.name,
      };
    } else if (
      vineyards &&
      vineyards.length > 0 &&
      teamMembers &&
      teamMembers.length > 0
    ) {
      setDisableSubject(false);
      vineyardGlobalActionSample.inUseVineyard = {
        id: vineyards[0]?.id,
        name: vineyards[0]?.name,
      };
    }

    reset(vineyardGlobalActionSample);
    setFormData(vineyardGlobalActionSample);
    console.log("vineyardGlobalActionSample", vineyardGlobalActionSample);
  }, [vineyards, teamMembers, selectedVineyards]);

  useEffect(() => {
    if (errors) {
      console.log("ERRORS", errors);
    }
  }, [errors]);

  return (
    <>
      {formData && formData !== undefined && (
        <div
          className="w-full p-4"
          style={{ borderColor: "var(--mui-palette-divider)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="w-full">
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
                    <Typography>General Info</Typography>
                    {/* * In use Vineyard */}
                    {/* TODO Needs to update both vineyard name and id */}
                    <FormControl fullWidth>
                      <InputLabel id="subject-select">
                        Selected vineyard
                      </InputLabel>
                      <Select
                        disabled={disableSubject}
                        name="inUseVineyard.name"
                        // labelId="subject-select"
                        id="inUseVineyard.name"
                        value={(formData.inUseVineyard?.name as string) || ""}
                        label="Vineyard"
                        onChange={(e) => {
                          handleInUseVineyardChange(e.target.value);
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
                      <Typography variant="body2" color="text.secondary">
                        Select execution Date
                      </Typography>
                      <DatePicker
                        name="executionDate"
                        value={
                          formData.executionDate instanceof Timestamp
                            ? dayjs(formData.executionDate.toDate())
                            : dayjs(formData.executionDate)
                        }
                        label="Execution Date"
                        disableFuture
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
                    <Stack gap={1} className="w-full">
                      <Typography variant="body2" color="text.secondary">
                        Enter the responsible person
                      </Typography>
                      <FormControl fullWidth>
                        <ResponsibleTeamMemberField
                          teamMembers={teamMembers}
                          onChange={(value) => {
                            handleChange("responsible.name", value);
                          }}
                        />
                        {errors.responsible &&
                          Array.isArray(errors.responsible) && (
                            <FormHelperText error>
                              {errors.responsible[0]?.message}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Stack>
                    <Typography>Lab Results</Typography>
                    {/* * LATEST LAB DATA */}
                    <Stack
                      direction={"column"}
                      gap={1}
                      display={"flex"}
                      className=""
                    >
                      <Typography variant="body2" color="text.secondary">
                        Enter the mass concentration of sugars (g/dm³)
                      </Typography>
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          label="Sugar (g/dm³)"
                          variant="outlined"
                          inputProps={{
                            min: "0.01",
                            max: "10000",
                            step: "0.01",
                          }}
                          {...register("inputData.sugar")}
                        />
                        {(errors.inputData as any)?.sugar?.message && (
                          <FormHelperText error>
                            {(errors.inputData as any)?.sugar.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                    <Stack
                      direction={"column"}
                      gap={1}
                      display={"flex"}
                      className=""
                    >
                      <Typography variant="body2" color="text.secondary">
                        Enter the acidity (g/dm³)
                      </Typography>
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          label="Acidity (g/dm³)"
                          variant="outlined"
                          inputProps={{
                            min: "0.01",
                            max: "10000",
                            step: "0.01",
                          }}
                          {...register("inputData.acidity")}
                        />
                      </FormControl>
                    </Stack>

                    <Stack gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Supporting Documents
                      </Typography>
                      {isUploading && (
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                        />
                      )}
                      {formData.supportingDocuments &&
                        formData.supportingDocuments.length > 0 &&
                        formData.supportingDocuments.map((doc, index) => (
                          <Stack
                            key={doc.name}
                            gap={1}
                            display={"flex"}
                            alignItems={"center"}
                            direction={"row"}
                            justifyContent={"space-between"}
                          >
                            <Stack
                              gap={1}
                              display={"flex"}
                              alignItems={"center"}
                              direction={"row"}
                            >
                              <File width={16} height={16} />
                              <Typography variant="body2">
                                {doc.name}
                              </Typography>
                            </Stack>
                            <IconButton
                              size="small"
                              className="max-w-[24px] max-h-[24px]"
                              color="error"
                              onClick={() => handleDeleteFile(doc.name, index)}
                            >
                              <DeleteOutline className="max-w-4 max-h-4" />
                            </IconButton>
                          </Stack>
                        ))}
                      <Stack gap={1} paddingY={2}>
                        <Button
                          variant="outlined"
                          component="label"
                          className="w-full flex items-center gap-2"
                        >
                          <BackupOutlined className="w-4 h-4" />
                          Upload File
                          <input type="file" hidden onChange={handleFile} />
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </div>
              </div>
            </div>

            <Box display={"flex"} justifyContent={"end"}>
              <FormControl>
                <Button type="submit" variant="contained" className="mt-8">
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
