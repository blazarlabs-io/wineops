import { ReactNode, useState } from "react";
import { Button, Card, Typography } from "@mui/material";
import CadastralDialog from "../dialogs/cadastral-dialog";

export type SimpleDataDisplayProps = {
  label: ReactNode;
  value: string[];
};

export default function CadastralDataDisplay({
  label,
  value,
}: SimpleDataDisplayProps) {
  const [openCadastrals, setOpenCadastrals] = useState<boolean>(false);
  return (
    <>
      {openCadastrals && (
        <CadastralDialog
          open={openCadastrals}
          onClose={() => setOpenCadastrals(false)}
          data={value}
        />
      )}
      <Card
        variant="outlined"
        className="min-w-[168px] flex flex-col gap-1 w-full p-2"
      >
        <Typography variant="body2" color="textDisabled">
          {label}
        </Typography>
        {value && Array.isArray(value) && value.length > 0 ? (
          value.length === 1 ? (
            value[0]
          ) : (
            <Button
              size="small"
              variant="text"
              component="span"
              className="lowercase!"
              sx={{
                padding: "0px 0px !important",
                maxWidth: "fit-content",
              }}
              onClick={() => setOpenCadastrals(true)}
            >
              {value?.length} cadastral numbers
            </Button>
          )
        ) : (
          "N/A"
        )}
      </Card>
    </>
  );
}
