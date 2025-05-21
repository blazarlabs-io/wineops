import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import { GROUP_ITEMS_TO_SHOW, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { normalizeToFlatStringArray } from "@/utils/data-normalization";
import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useState, type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [groupCadastrals, setGroupCadastrals] = useState<string[]>([]);
  const [hasCertifications, setHasCertifications] = useState<boolean>(false);

  // useEffect(() => {
  // if (!node.allChildrenCount) return;

  let normalizedCadastrals: string[] = [];
  let amIaGroup: boolean = false;
  let isCertified: boolean = false;

  if (node.allChildrenCount && node.allChildrenCount > 1) {
    // console.log("I AM A GROUP", node);
    amIaGroup = true;

    if (node.aggData && node.aggData.cadastralNumber) {
      // * The typeof node.aggData.cadastralNumber can be either a string or an array
      if (typeof node.aggData.cadastralNumber !== "string") {
        normalizedCadastrals = normalizeToFlatStringArray(
          node.aggData.cadastralNumber
        );
      } else {
        normalizedCadastrals = [node.aggData.cadastralNumber];
      }
    }
    if (node.allLeafChildren && node.allLeafChildren.length > 0) {
      if (
        node.allLeafChildren[0].data.certifications &&
        node.allLeafChildren[0].data.certifications.length > 0
      ) {
        isCertified = true;
      } else {
        isCertified = false;
      }
    }
  } else {
    amIaGroup = false;
    console.log("I AM NOT A GROUP", node);
    if (node.aggData && node.aggData.cadastralNumber) {
      normalizedCadastrals = node.aggData.cadastralNumber;
    }

    if (node.allLeafChildren && node.allLeafChildren.length > 0) {
      if (
        node.allLeafChildren[0].data.certifications &&
        node.allLeafChildren[0].data.certifications.length > 0
      ) {
        isCertified = true;
      } else {
        isCertified = false;
      }
    }

    console.log("normalizedCadastrals", normalizedCadastrals);
  }
  // }, [node]);
  useEffect(() => {
    setIsGroup(amIaGroup);
    setGroupCadastrals(normalizedCadastrals);
    setHasCertifications(isCertified);
  }, []);

  useEffect(() => {
    console.log("groupCadastrals", groupCadastrals);
  }, [groupCadastrals]);

  return (
    <>
      {isGroup ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={1.5}
          justifyItems={"flex-start"}
          height={ROW_HEIGHT_DEFAULT}
          sx={{
            borderLeft: node.level > 0 ? "8px" : "",
            borderStyle: "solid",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          <div className="flex flex-col items-start gap-2 pl-4">
            <Typography variant="body1" className="max-h-fit leading-4">
              {value}
            </Typography>
          </div>
          {hasCertifications ? (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft:
                  node.group && node.data === undefined
                    ? ""
                    : node.level > 0
                      ? "8px"
                      : "",
              }}
            >
              <CertificationsDataDisplay
                certifications={node.data.info.certifications}
              />
            </div>
          ) : (
            <div className="flex flex-col pl-4">
              <CertificationsDataDisplay
                certifications={{
                  eco: { active: false, fileUrl: "" },
                  igp: { active: false, fileUrl: "" },
                  dop: { active: false, fileUrl: "" },
                }}
              />
            </div>
          )}
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            {groupCadastrals &&
              groupCadastrals.length > 0 &&
              groupCadastrals.map((cad, index) => {
                return (
                  <Box
                    key={index + cad}
                    display={"flex"}
                    flexDirection={"column"}
                    height={ROW_HEIGHT_DEFAULT}
                    gap={1}
                    sx={{
                      borderLeft:
                        node.level > 0 && index > GROUP_ITEMS_TO_SHOW
                          ? "8px"
                          : "",
                      borderStyle: "solid",
                      borderColor: "var(--mui-palette-divider)",
                      paddingLeft: "16px",
                      display: index < GROUP_ITEMS_TO_SHOW ? "flex" : "none",
                    }}
                    className="max-h-fit"
                  >
                    <Typography
                      variant="body2"
                      className="max-h-fit leading-1.5 text-xs"
                    >
                      Cad Ref. {cad}
                    </Typography>
                    {groupCadastrals.length - GROUP_ITEMS_TO_SHOW > 0 && (
                      <Typography
                        variant="body2"
                        className="max-h-fit leading-1.5 text-sm cursor-pointer underline"
                        color="primary"
                        style={{
                          display: index === 1 ? "flex" : "none",
                        }}
                      >
                        + {groupCadastrals.length - GROUP_ITEMS_TO_SHOW} more
                      </Typography>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={1.5}
          alignItems={"flex-start"}
          height={ROW_HEIGHT_DEFAULT}
          sx={{
            borderLeft: node.level > 0 ? "8px" : "",
            borderStyle: "solid",
            borderColor: "var(--mui-palette-divider)",
          }}
          className="pl-4"
        >
          <div className="flex flex-col gap-2">
            <Typography variant="body1" className="max-h-fit leading-4">
              {value}
            </Typography>
          </div>
          {hasCertifications ? (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft:
                  node.group && node.data === undefined
                    ? ""
                    : node.level > 0
                      ? "8px"
                      : "",
              }}
            >
              <CertificationsDataDisplay
                certifications={node.data.info.certifications}
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <CertificationsDataDisplay
                certifications={{
                  eco: { active: false, fileUrl: "" },
                  igp: { active: false, fileUrl: "" },
                  dop: { active: false, fileUrl: "" },
                }}
              />
            </div>
          )}
          {groupCadastrals &&
            groupCadastrals.length > 0 &&
            groupCadastrals[0] && (
              <Typography
                variant="body2"
                className="max-h-fit leading-1.5 text-xs"
              >
                Cad Ref. {groupCadastrals[0]}
              </Typography>
            )}
        </Box>
      )}
    </>
  );
  // return (
  //   <>
  //     {node.group && (
  //       <Box
  //         display={"flex"}
  //         flexDirection={"column"}
  //         justifyContent={"center"}
  //         gap={1}
  //         alignItems={"flex-start"}
  //         height={ROW_HEIGHT_DEFAULT}
  //         sx={{
  //           borderLeft: node.level > 0 ? "8px" : "",
  //           borderStyle: "solid",
  //           borderColor: "var(--mui-palette-divider)",
  //         }}
  //       >
  //         <div className="flex flex-col gap-2 pl-4">
  //           <Typography variant="body1" className="max-h-fit leading-4">
  //             {value}
  //           </Typography>
  //         </div>
  //         {node.data && node.data.info && node.data.info.certifications ? (
  //           <div
  //             className=""
  //             style={{
  //               display: "flex",
  //               flexDirection: "column",
  //               paddingLeft:
  //                 node.group && node.data === undefined
  //                   ? ""
  //                   : node.level > 0
  //                     ? "8px"
  //                     : "",
  //             }}
  //           >
  //             <CertificationsDataDisplay
  //               certifications={node.data.info.certifications}
  //             />
  //           </div>
  //         ) : (
  //           <div className="flex flex-col pl-4">
  //             <CertificationsDataDisplay
  //               certifications={{
  //                 eco: { active: false, fileUrl: "" },
  //                 igp: { active: false, fileUrl: "" },
  //                 dop: { active: false, fileUrl: "" },
  //               }}
  //             />
  //           </div>
  //         )}
  //         <div className="flex flex-col gap-[4px]">
  //           {node.aggData &&
  //             node.aggData.cadastralNumber &&
  //             node.aggData.cadastralNumber.length > 0 &&
  //             node.aggData.cadastralNumber.map((agg: string) => {
  //               return (
  //                 <div key={agg} className="flex flex-col pl-4">
  //                   {typeof agg === "string" ? (
  //                     <Typography
  //                       variant="body2"
  //                       className="leading-[1] truncate text-xs"
  //                     >
  //                       {agg}
  //                     </Typography>
  //                   ) : (
  //                     <Box display={"flex"} flexDirection={"column"} gap={0.5}>
  //                       {(agg as string[] | string) &&
  //                         (agg as string[]).map(
  //                           (item: string, index: number) => {
  //                             // console.log("item", item, index);
  //                             return (
  //                               <Box key={item} className="flex flex-col">
  //                                 {/* {typeof item === "string" && index === 0 && (
  //                                   <Typography
  //                                     variant="body2"
  //                                     className="leading-[1] truncate text-xs"
  //                                   >
  //                                     {item}
  //                                   </Typography>
  //                                 )} */}
  //                                 {/* {index === 0 ? (
  //                                   <Typography
  //                                     variant="body2"
  //                                     className="leading-[1] truncate text-xs"
  //                                   >
  //                                     {item}
  //                                   </Typography>
  //                                 ) : (
  //                                   <>
  //                                     {Array.isArray(agg) && (
  //                                       <Typography
  //                                         variant="body2"
  //                                         className="leading-[1] m-[0px] p-[0px] text-muted-foreground underline cursor-pointer"
  //                                       >
  //                                         +{(agg as string[]).length - 1} more
  //                                       </Typography>
  //                                     )}
  //                                   </>
  //                                 )} */}
  //                               </Box>
  //                             );
  //                           }
  //                         )}
  //                     </Box>
  //                   )}
  //                 </div>
  //               );
  //             })}
  //         </div>
  //       </Box>
  //     )}
  //   </>
  // );
};
