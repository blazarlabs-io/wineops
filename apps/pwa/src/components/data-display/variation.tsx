import { cn } from "@/utils/styling";
import { ArrowUp, ArrowDown } from "lucide-react";

type VariationProps = {
  variation: number;
};

export default function Variation({ variation }: VariationProps) {
  if (variation === 0) return null;

  const isNegative = variation < 0;
  const Arrow = isNegative ? ArrowDown : ArrowUp;
  const color = isNegative ? "text-[#FF7878]" : "text-[#63DA3F]";

  return (
    <div className="flex items-start gap-[1px]">
      <Arrow className={cn("w-3 h-3", color)} />
      <span className={cn("text-[10px]", color)}>{variation}</span>
    </div>
  );
}
