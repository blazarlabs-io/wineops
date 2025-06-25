import { LabReport } from "@/models/types/db";
import { Avatar, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";

export type LabSimpleDataDisplayProps = {
  data: LabReport;
};

export default function LabReportResponsibleDataDisplay({
  data,
}: LabSimpleDataDisplayProps) {
  if (!data) return;

  return (
    <>
      {data && data !== undefined && (
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-1">
            <Typography
              variant="caption"
              color="textDisabled"
              className="text-xs text-muted-foreground leading-[0]"
            >
              {new Date(
                (data.date as Timestamp)?.seconds * 1000
              ).toDateString()}
            </Typography>
            <div className="flex items-center gap-2">
              <Avatar sx={{ width: 20, height: 20 }}>
                <Typography variant="caption">
                  {data.responsible.name.charAt(0).toLocaleUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="body2">{data.responsible.name}</Typography>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-1">
                <p className=" text-muted-foreground leading-[0.8]">Sugar</p>
                <p className="text-[10px] leading-[0.8]">{data.units}</p>
              </div>
              <div className="flex items-start gap-1">
                <p className="text-muted-foreground leading-[0.8]">
                  {data.results.sugar.value.toFixed(2)}
                </p>
                <div
                  className="flex items-start gap-[1px]"
                  style={{
                    color:
                      data.results.sugar.variation.toString().charAt(0) === "-"
                        ? "#FF7878"
                        : "#00C950",
                  }}
                >
                  {data.results.sugar.variation.toString().charAt(0) === "-" ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUp className="w-3 h-3" />
                  )}

                  <p className="text-[10px] leading-[0.8]">
                    {data.results.sugar.variation.toString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-1">
                <p className="text-muted-foreground leading-[0.8]">Acidity</p>
                <div className="flex items-start gap-[1px]">
                  <p className="text-[10px] leading-[0.8]">{data.units}</p>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <p className="text-muted-foreground leading-[0.8]">
                  {data.results.acidity.value.toFixed(2)}
                </p>
                <div
                  className="flex items-start gap-[1px]"
                  style={{
                    color:
                      data.results.sugar.variation.toString().charAt(0) === "-"
                        ? "#FF7878"
                        : "#00C950",
                  }}
                >
                  {data.results.sugar.variation.toString().charAt(0) === "-" ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUp className="w-3 h-3" />
                  )}

                  <p className="text-[10px] leading-[0.8]">
                    {data.results.sugar.variation.toString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
