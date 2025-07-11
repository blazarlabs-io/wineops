/* eslint-disable @typescript-eslint/no-explicit-any */
import UploadDocumentsDialog from "@/components/dialogs/upload-documents-dialog";
import { Backup, FilterList } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import {
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        "flex h-9 items-center justify-center rounded border border-neutral-200 cursor-pointer dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-200 whitespace-nowrap select-none hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 active:bg-neutral-100 dark:active:bg-neutral-700",
        props.className
      )}
    />
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "h-9 w-full rounded border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 px-2.5 text-base text-neutral-900 dark:text-neutral-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600",
        props.className
      )}
    />
  );
}

type DocumentsTableToolbarProps = {
  uploadedDocuments?: any[];
  onDocumentUpload?: (data: any) => Promise<void>;
};

export default function DocumentsTableToolbar({
  uploadedDocuments,
  onDocumentUpload,
}: DocumentsTableToolbarProps) {
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  return (
    <>
      <UploadDocumentsDialog
        open={openUploadDialog}
        subject=""
        uid=""
        onClose={() => setOpenUploadDialog(false)}
        uploadedDocuments={uploadedDocuments}
        onDocumentUpload={onDocumentUpload}
      />
      <Toolbar
        className="gap-2! p-2! border-t-[1px]"
        style={{ borderColor: "var(--mui-palette-divider)" }}
      >
        <ToolbarButton
          render={
            <Button onClick={() => setOpenUploadDialog(true)}>
              <Backup className="h-4! w-4! mr-1" />
              Upload
            </Button>
          }
        />

        <FilterPanelTrigger
          render={
            <ToolbarButton
              render={
                <Button>
                  <FilterList className="h-4! w-4! mr-1" />
                  Filter
                </Button>
              }
            />
          }
        />
        {/* <ExportCsv render={<ToolbarButton render={<Button>Export</Button>} />} /> */}
        {/* <ExportPrint
        render={
          <ToolbarButton
            render={
              <Button>
                <Print className="h-4! w-4! mr-1" />
                Print
              </Button>
            }
          />
        }
      /> */}

        <QuickFilter
          render={(props, state) => (
            <div {...props} className="flex overflow-clip">
              <QuickFilterTrigger
                className={state.expanded ? "rounded-r-none border-r-0" : ""}
                render={
                  <ToolbarButton
                    render={
                      <Button aria-label="Search">
                        <SearchIcon fontSize="small" />
                      </Button>
                    }
                  />
                }
              />
              <div
                className={clsx(
                  "flex overflow-clip transition-all duration-300 ease-in-out",
                  state.expanded ? "w-48" : "w-0"
                )}
              >
                <QuickFilterControl
                  aria-label="Search"
                  placeholder="Search"
                  render={({ slotProps, size, ...controlProps }) => (
                    <TextInput
                      {...controlProps}
                      {...slotProps?.htmlInput}
                      className={clsx(
                        "flex-1 rounded-l-none",
                        state.expanded && state.value !== "" && "rounded-r-none"
                      )}
                    />
                  )}
                />
                {state.expanded && state.value !== "" && (
                  <QuickFilterClear
                    render={
                      <Button aria-label="Clear" className="rounded-l-none">
                        <CancelIcon fontSize="small" />
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          )}
        />
      </Toolbar>
    </>
  );
}
