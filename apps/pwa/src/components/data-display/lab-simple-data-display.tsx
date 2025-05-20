import { LabDataSimple } from "@/models/types/db";
import { ArrowUp, ArrowDown } from "lucide-react";

export type LabSimpleDataDisplayProps = {
  data: LabDataSimple[];
};

export default function LabSimpleDataDisplay({
  data,
}: LabSimpleDataDisplayProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <p className="text-xs text-muted-foreground leading-[0.8]">
        {new Date(data[0].items[0].date).toISOString().split("T")[0]}
      </p>
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-1">
            <p className=" text-muted-foreground leading-[0.8]">
              {data[0].items[0].name}
            </p>
            <div className="flex items-start gap-[1px] leading-[0.8]">
              <p className="text-[10px] leading-[0.8]">
                {data[0].items[0].unit}
              </p>
              {/* <p className="text-[8px] leading-[0.8]">3</p> */}
            </div>
          </div>
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">
              {data[0].items[0].value}
            </p>
            <div
              className="flex items-start gap-[1px]"
              style={{
                color:
                  data[0].items[0].variation.toString().charAt(0) === "-"
                    ? "#FF7878"
                    : "#00C950",
              }}
            >
              {data[0].items[0].variation.toString().charAt(0) === "-" ? (
                <ArrowDown className="w-3 h-3" />
              ) : (
                <ArrowUp className="w-3 h-3" />
              )}

              <p className="text-[10px] leading-[0.8]">
                {data[0].items[0].variation}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">
              {data[0].items[1].name}
            </p>
            <div className="flex items-start gap-[1px]">
              <p className="text-[10px] leading-[0.8]">
                {data[0].items[1].unit}
              </p>
              {/* <p className="text-[8px] leading-[0.8]">3</p> */}
            </div>
          </div>
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">
              {data[0].items[1].value}
            </p>
            <div
              className="flex items-start gap-[1px]"
              style={{
                color:
                  data[0].items[1].variation.toString().charAt(0) === "-"
                    ? "#FF7878"
                    : "#00C950",
              }}
            >
              {data[0].items[1].variation.toString().charAt(0) === "-" ? (
                <ArrowDown className="w-3 h-3" />
              ) : (
                <ArrowUp className="w-3 h-3" />
              )}

              <p className="text-[10px] leading-[0.8]">
                {data[0].items[1].variation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
