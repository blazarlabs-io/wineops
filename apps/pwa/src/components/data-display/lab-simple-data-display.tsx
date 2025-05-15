/* eslint-disable @typescript-eslint/no-unused-vars */
import { LabElement } from "@/models/types/db";
import { ArrowUp, ArrowDown } from "lucide-react";

export type LabSimpleDataDisplayProps = {
  data: LabElement[];
};

export default function LabSimpleDataDisplay({
  data,
}: LabSimpleDataDisplayProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <p className="text-xs text-muted-foreground leading-[0.8]">12/05/2025</p>
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-1">
            <p className=" text-muted-foreground leading-[0.8]">Sugar</p>
            <div className="flex items-start gap-[1px] leading-[0.8]">
              <p className="text-[10px] leading-[0.8]">g/dm</p>
              <p className="text-[8px] leading-[0.8]">3</p>
            </div>
          </div>
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">4.1</p>
            <div className="flex items-start gap-[1px]">
              <ArrowUp className="w-3 h-3 text-[#00C950]" />
              <p className="text-[10px] text-[#00C950] leading-[0.8]">0.3</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">Acidity</p>
            <div className="flex items-start gap-[1px]">
              <p className="text-[10px] leading-[0.8]">g/dm</p>
              <p className="text-[8px] leading-[0.8]">3</p>
            </div>
          </div>
          <div className="flex items-start gap-1">
            <p className="text-muted-foreground leading-[0.8]">3.5</p>
            <div className="flex items-start gap-[1px]">
              <ArrowDown className="w-3 h-3 text-destructive" />
              <p className="text-[10px] text-destructive leading-[0.8]">0.6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
