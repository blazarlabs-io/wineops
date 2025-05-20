import { cn } from "@/utils/styling";
import { Typography, useTheme } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface LabSingleItemDataDisplayProps {
  name: string;
  value: string;
  unit: string;
  variation: string;
}

export default function LabSingleItemDataDisplay({
  name,
  value,
  unit,
  variation,
}: LabSingleItemDataDisplayProps) {
  const theme = useTheme();
  const [isVariationPositive, setIsVariationPositive] = useState<boolean>(true);
  const mountRef = useRef<boolean>(false);

  const primaryColor: string = theme.palette.primary.main;
  const secondaryColor: string = theme.palette.secondary.main;

  useEffect(() => {
    console.log("=================", name, value, unit, variation);
    if (!mountRef.current && variation.charAt(0) === "-") {
      setIsVariationPositive(false);
      mountRef.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col items-start justify-center gap-0">
      <div className="flex items-center max-h-[24px] gap-1">
        <div
          className="w-1 h-3"
          style={{
            backgroundColor: name === "Sugar" ? primaryColor : secondaryColor,
          }}
        />
        <div>
          <p className="text-muted-foreground">{name}</p>
        </div>
        <div
          className={cn(
            "max-h-[24px] flex gap-1 mt-[-8px]",
            isVariationPositive ? "text-[#00C950]" : "text-[#FF7878]"
          )}
        >
          {isVariationPositive ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 rotate-180" />
          )}
          <Typography className="text-[10px]">
            {parseFloat(variation).toFixed(2)}
          </Typography>
          <div className="flex gap-[1px]">
            <Typography className="text-[10px]">
              {unit.slice(0, unit.length - 1)}
            </Typography>
            <Typography className="text-[10px] mt-[-3px]">
              {unit.charAt(unit.length - 1)}
            </Typography>
          </div>
        </div>
      </div>
      <div>
        <div className="max-h-fit  flex items-center gap-2">
          <Typography className="text-sm">
            {parseFloat(value).toFixed(2)}
          </Typography>
          <div className="flex gap-1">
            <Typography className="text-sm">
              {unit.slice(0, unit.length - 1)}
            </Typography>
            <Typography className="text-[10px]">
              {unit.charAt(unit.length - 1)}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
