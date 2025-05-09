import { cn } from "@/utils/styling";

interface StripedBarProps {
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

export default function StripedBar({
  className,
  lightColor = "transparent",
  darkColor = "rgba(0,0,0,0.1)",
}: StripedBarProps) {
  return (
    <div className={cn("h-4 overflow-hidden", className)}>
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `linear-gradient(-45deg, ${darkColor} 25%, ${lightColor} 25%, ${lightColor} 50%, ${darkColor} 50%, ${darkColor} 75%, ${lightColor} 75%, ${lightColor})`,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
