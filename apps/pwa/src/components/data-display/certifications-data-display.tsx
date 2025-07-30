import { Certifications } from "@/models/types/db";
import { cn } from "@/utils/styling";
import { Tooltip } from "@mui/material";
import { Leaf, MapPinned, ShieldCheck, Snowflake, Sprout } from "lucide-react";

const ICONS_TOOLTIPS = {
  eco: {
    title: "Eco certified",
    icon: Sprout,
  },
  bio: {
    title: "BIO certified",
    icon: Leaf,
  },
  igp: {
    title: "IGP certified",
    icon: MapPinned,
  },
  dop: {
    title: "DOP certified",
    icon: ShieldCheck,
  },
  ice: {
    title: "Designated for ice wine",
    icon: Snowflake,
  },
};

export type CertificationsDataDisplayProps = {
  certifications: Certifications;
  showOnlyActive?: boolean;
};

export default function CertificationsDataDisplay({
  certifications,
  showOnlyActive = false,
}: CertificationsDataDisplayProps) {
  if (!certifications) return null;

  return (
    <div className="flex items-center gap-2 w-full max-h-fit">
      {Object.entries(ICONS_TOOLTIPS).map(([key, { title, icon: Icon }]) => {
        const isActive = certifications[key as keyof Certifications]?.active;

        if (showOnlyActive && !isActive) return null;

        return (
          <Tooltip key={key} title={title}>
            <button type="button" className="cursor-pointer">
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "opacity-100" : "opacity-30"
                )}
              />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
