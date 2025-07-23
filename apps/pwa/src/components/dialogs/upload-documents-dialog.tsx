/* eslint-disable @typescript-eslint/no-explicit-any */
import { Backup } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FileUploaderField from "../forms/custom-fields/file-uploader-field";
import { useCallback, useEffect, useState } from "react";

export interface CreateNoteDialogProps {
  open: boolean;
  subject: string;
  uid: string;
  onClose: () => void;
  onDocumentUpload?: (data: any) => Promise<void>;
}

export default function UploadDocumentsDialog({
  open,
  subject,
  uid,

  onClose,
  onDocumentUpload,
}: CreateNoteDialogProps) {
  const [currentUploads, setCurrentUploads] = useState<any[]>([]);

  const handleUploadDocuments = useCallback(
    (file: { name: string; url: string }) => {
      if (!file) return;

      setCurrentUploads((prevFiles) =>
        file?.url
          ? [...prevFiles, file]
          : prevFiles?.filter(({ name }) => name !== file.name)
      );
    },
    []
  );

  const handleClose = () => {
    onClose();
    setCurrentUploads([]);
  };

  const onDoneClick = async () => {
    if (currentUploads.length > 0 && !!onDocumentUpload) {
      await onDocumentUpload(currentUploads);
    }

    handleClose();
  };

  useEffect(() => {
    return () => {
      setCurrentUploads([]);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create-team-member-dialog-title"
      aria-describedby="create-team-member-dialog-description"
    >
      <DialogTitle
        id="create-team-member-dialog-title"
        className="flex items-center gap-1"
      >
        <Backup color="primary" />
        Upload Documents
      </DialogTitle>

      <DialogContent className="min-w-[400px] py-[0px]!">
        <DialogContentText id="create-team-member-dialog-description">
          Upload documents to your winery operation.
        </DialogContentText>

        <FileUploaderField
          path="documents"
          data={[]}
          onDocumentUpload={handleUploadDocuments}
        />
        {/* <CreateNoteForm
          teamMembers={teamMembers}
          uid={uid}
          onDataSubmit={handleCreateNewNote}
          onClose={onClose}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDoneClick}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
