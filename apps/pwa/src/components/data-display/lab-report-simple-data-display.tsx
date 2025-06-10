import { LabDataSimple, LabReport } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";
import { ArrowUp, ArrowDown } from "lucide-react";

export type LabSimpleDataDisplayProps = {
  data: LabReport;
};

export default function LabReportSimpleDataDisplay({
  data,
}: LabSimpleDataDisplayProps) {
  if (!data) return;
  return (
    <>
      {data && data !== undefined && (
        <div className="flex flex-col items-start justify-start gap-4">
          <p className="text-xs text-muted-foreground leading-[0.8]">
            {new Date((data.date as Timestamp)?.seconds * 1000).toDateString()}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
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
