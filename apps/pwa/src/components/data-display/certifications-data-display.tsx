import { Certifications } from "@/models/types/db";
import { cn } from "@/utils/styling";
import { Tooltip } from "@mui/material";
import { Leaf, MapPinned, ShieldCheck, Snowflake, Sprout } from "lucide-react";

type CertificationsDataDisplayProps = {
  certifications: Certifications;
};

export default function CertificationsDataDisplay({
  certifications,
}: CertificationsDataDisplayProps) {
  return (
    <div className="flex items-center gap-2 w-full max-h-fit">
      <Tooltip title="ECO certified">
        <button type="button" className="cursor-pointer">
          <Sprout
            className={cn(
              "w-4 h-4",
              certifications?.eco?.active ? "opacity-100" : "opacity-30"
            )}
          />
        </button>
      </Tooltip>
      <Tooltip title="BIO certified">
        <button type="button" className="cursor-pointer">
          <Leaf
            className={cn(
              "w-4 h-4",
              certifications?.bio?.active ? "opacity-100" : "opacity-30"
            )}
          />
        </button>
      </Tooltip>
      <Tooltip title="IGP certified">
        <button type="button" className="cursor-pointer">
          <MapPinned
            className={cn(
              "w-4 h-4",
              certifications?.igp?.active ? "opacity-100" : "opacity-30"
            )}
          />
        </button>
      </Tooltip>
      <Tooltip title="DOP certified">
        <button type="button" className="cursor-pointer">
          <ShieldCheck
            className={cn(
              "w-4 h-4",
              certifications?.dop?.active ? "opacity-100" : "opacity-30"
            )}
          />
        </button>
      </Tooltip>
      <Tooltip title="Designated for ice wine">
        <button type="button" className="cursor-pointer">
          <Snowflake
            className={cn(
              "w-4 h-4",
              certifications?.ice?.active ? "opacity-100" : "opacity-30"
            )}
          />
        </button>
      </Tooltip>
    </div>
  );
}
