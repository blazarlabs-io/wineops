"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { BackupOutlined, DeleteOutline } from "@mui/icons-material";
import {
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { File } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type FileUploaderFieldProps = {
  path: string;
  data: any;
  onDocumentUpload?: (data: any) => void;
  onFileData?: (data: any) => void;
};

export default function FileUploaderField({
  path,
  data = [],
  onDocumentUpload,
  onFileData,
}: FileUploaderFieldProps) {
  const { user } = useAuth();

  const [error, setError] = useState<{ type: string; message: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [documents, setDocuments] = useState<any[]>(data);

  const handleFile = useCallback(
    (e: any) => {
      const file = e.target.files[0];

      if (!file) {
        setError({
          type: "manual",
          message: `Missing file`,
        });

        return;
      }

      if ((documents || []).map(({ name }) => name).includes(file.name)) {
        setError({
          type: "manual",
          message: `File ${file.name} has already been uploaded`,
        });

        return;
      }

      setError(undefined);

      db.storage.uploadFile(
        file,
        user?.uid,
        path,
        (progress: number) => {
          setIsUploading(true);
          setUploadProgress(progress);
        },
        (complete: string) => {
          setIsUploading(false);
          setUploadProgress(0);
          setDocuments((prev) => [
            ...prev,
            {
              name: file.name,
              url: complete,
            },
          ]);

          onDocumentUpload?.({
            name: file.name,
            url: complete,
          });

          if (onFileData) {
            onFileData({
              name: file.name,
              url: complete,
              media: {
                type: file.type,
                size: file.size,
              },
            });
          }

          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        (error: Error) => {
          setIsUploading(false);
          setUploadProgress(0);

          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      );
    },
    [documents, onDocumentUpload, path, user?.uid],
  );

  const handleDeleteFile = useCallback(
    async (name: string, index: number) => {
      setDocuments((prev) => prev.filter((doc) => doc.name !== name));

      setError(undefined);
      onDocumentUpload?.({ name });
      const deleteFileRes = await db.storage.deleteFile(user?.uid, path, name);

      if (deleteFileRes.status == 200) {
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
      }
    },
    [onDocumentUpload, path, user?.uid],
  );

  return (
    <Stack gap={1}>
      <Typography variant="body2" color="text.secondary">
        Supporting Documents
      </Typography>
      {isUploading && (
        <LinearProgress variant="determinate" value={uploadProgress} />
      )}
      {documents &&
        documents.length > 0 &&
        documents.map((doc: any, index: number) => (
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
              <Typography variant="body2">{doc.name}</Typography>
            </Stack>
            <IconButton
              size="small"
              className="max-w-[36px] max-h-[36px]"
              color="error"
              onClick={() => handleDeleteFile(doc.name, index)}
            >
              <DeleteOutline className="max-w-6 max-h-6" />
            </IconButton>
          </Stack>
        ))}

      {error && (
        <Typography variant="body2" color="error" className="mt-1">
          {error?.message as string}
        </Typography>
      )}
      <Stack gap={1} paddingY={2}>
        <Button
          variant="outlined"
          component="label"
          className="w-full flex items-center gap-2"
        >
          <BackupOutlined className="w-4 h-4" />
          Upload File
          <input type="file" hidden ref={fileInputRef} onChange={handleFile} />
        </Button>
      </Stack>
    </Stack>
  );
}
