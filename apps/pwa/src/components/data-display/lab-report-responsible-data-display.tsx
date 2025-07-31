import { LabReport } from "@/models/types/db";
import { Avatar, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";

export const RESULTS_KEYS = ["alcohol", "sugar", "acidity"];

type LabSimpleDataDisplayProps = {
  data: LabReport;
  prevData?: LabReport;
};

export default function LabReportResponsibleDataDisplay({
  data,
  prevData,
}: LabSimpleDataDisplayProps) {
  if (!data) return;

  const cols = RESULTS_KEYS.filter((key) => key in data.results)?.length || 1;

  return (
    <div className="grid grid-cols-[150px_1fr] w-full">
      <div className="flex flex-col gap-1">
        <Typography
          variant="caption"
          color="textDisabled"
          className="text-xs text-muted-foreground leading-[0]"
        >
          {new Date((data.date as Timestamp)?.seconds * 1000).toDateString()}
        </Typography>
        <div className="flex items-center gap-2">
          <Avatar sx={{ width: 20, height: 20 }}>
            <Typography variant="caption">
              {data.responsible?.name?.charAt(0).toLocaleUpperCase()}
            </Typography>
          </Avatar>
          <Typography variant="body2" className="whitespace-normal">
            {data.responsible?.name}
          </Typography>
        </div>
      </div>
      <div className={`grid grid-cols-${cols} items-center gap-1`}>
        {RESULTS_KEYS.map((key) => {
          const result = data?.results?.[key]?.value;
          const prevResult = prevData?.results?.[key]?.value;
          const variation =
            result && prevResult ? result - prevResult : undefined;

          if (!result) return null;

          return (
            <div key={key} className="flex flex-col gap-3">
              <div className="flex items-start gap-1">
                <p className=" text-muted-foreground leading-[0.8] capitalize">
                  {key}
                </p>
                <p className="text-[10px] leading-[0.8]">
                  {key === "alcohol"
                    ? "%"
                    : ["sugar", "acidity"].includes(key)
                      ? "g/dm³"
                      : ""}
                </p>
              </div>
              <div className="flex items-start gap-1">
                <p className="text-muted-foreground leading-[0.8]">
                  {result.toFixed(2)}
                </p>
                {variation && (
                  <div
                    className="flex items-start gap-[1px]"
                    style={{
                      color: variation < 0 ? "#FF7878" : "#00C950",
                    }}
                  >
                    {variation < 0 ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUp className="w-3 h-3" />
                    )}

                    <p className="text-[10px] leading-[0.8]">
                      {variation.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
