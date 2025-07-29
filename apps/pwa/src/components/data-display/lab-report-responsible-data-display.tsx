import { LabReport } from "@/models/types/db";
import { Avatar, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";

type LabSimpleDataDisplayProps = {
  data: LabReport;
  prevData?: LabReport;
};

export default function LabReportResponsibleDataDisplay({
  data,
  prevData,
}: LabSimpleDataDisplayProps) {
  if (!data) return;

  const sugar = data?.results?.sugar?.value;
  const acidity = data?.results?.acidity?.value;

  const prevSugar = prevData?.results?.sugar?.value;
  const prevAcidity = prevData?.results?.acidity?.value;

  const sugarVariation = sugar && prevSugar ? sugar - prevSugar : undefined;
  const acidityVariation =
    acidity && prevAcidity ? acidity - prevAcidity : undefined;

  return (
    <>
      {data && data !== undefined && (
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col gap-1">
            <Typography
              variant="caption"
              color="textDisabled"
              className="text-xs text-muted-foreground leading-[0]"
            >
              {new Date(
                (data.date as Timestamp)?.seconds * 1000
              ).toDateString()}
            </Typography>
            <div className="flex items-center gap-2">
              <Avatar sx={{ width: 20, height: 20 }}>
                <Typography variant="caption">
                  {data.responsible?.name?.charAt(0).toLocaleUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="body2">{data.responsible?.name}</Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-1">
            {sugar && (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-1">
                  <p className=" text-muted-foreground leading-[0.8]">Sugar</p>
                  <p className="text-[10px] leading-[0.8]">{data.units}</p>
                </div>
                <div className="flex items-start gap-1">
                  <p className="text-muted-foreground leading-[0.8]">
                    {sugar.toFixed(2)}
                  </p>
                  {sugarVariation && (
                    <div
                      className="flex items-start gap-[1px]"
                      style={{
                        color: sugarVariation < 0 ? "#FF7878" : "#00C950",
                      }}
                    >
                      {sugarVariation < 0 ? (
                        <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUp className="w-3 h-3" />
                      )}

                      <p className="text-[10px] leading-[0.8]">
                        {sugarVariation.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {acidity && (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-1">
                  <p className="text-muted-foreground leading-[0.8]">Acidity</p>
                  <div className="flex items-start gap-[1px]">
                    <p className="text-[10px] leading-[0.8]">{data.units}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <p className="text-muted-foreground leading-[0.8]">
                    {acidity.toFixed(2)}
                  </p>
                  {acidityVariation && (
                    <div
                      className="flex items-start gap-[1px]"
                      style={{
                        color: acidityVariation < 0 ? "#FF7878" : "#00C950",
                      }}
                    >
                      {acidityVariation < 0 ? (
                        <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUp className="w-3 h-3" />
                      )}

                      <p className="text-[10px] leading-[0.8]">
                        {acidityVariation.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
