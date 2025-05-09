import { Certifications } from "@/models/types/db";
import { cn } from "@/utils/styling";
import { ShieldCheck, Snowflake, Sprout } from "lucide-react";

export type CertificationsDataDisplayProps = {
  certifications: Certifications;
};

export default function CertificationsDataDisplay({
  certifications,
}: CertificationsDataDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="cursor-pointer">
        <Sprout
          className={cn(
            "w-4 h-4",
            certifications.eco.active
              ? "text-foreground"
              : "text-muted-foreground/50"
          )}
        />
      </button>
      <button type="button" className="cursor-pointer">
        <Snowflake
          className={cn(
            "w-4 h-4",
            certifications.igp.active
              ? "text-foreground"
              : "text-muted-foreground/50"
          )}
        />
      </button>
      <button type="button" className="cursor-pointer">
        <ShieldCheck
          className={cn(
            "w-4 h-4",
            certifications.dop.active
              ? "text-foreground"
              : "text-muted-foreground/50"
          )}
        />
      </button>
    </div>
  );
}
