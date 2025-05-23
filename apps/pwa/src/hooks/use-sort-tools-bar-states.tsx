import { DashboardEntity } from "@/models/types/dashboard";
import { useEffect, useState } from "react";

export const useSortToolsBarStates = <T extends DashboardEntity>(data: T[]) => {
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [enableGrouping, setEnableGrouping] = useState<boolean>(false);
  const [enableDelete, setEnableDelete] = useState<boolean>(false);
  const [enableUngrouping, setEnableUngrouping] = useState<boolean>(false);

  useEffect(() => {
    if (data && data !== undefined && data.length > 0) {
      if (data.length === 1) {
        setEnableEdit(true);
      } else {
        setEnableEdit(false);
      }
      setEnableGrouping(true);
      setEnableDelete(true);

      const isDataGrouped = data.some(({ group }) => {
        if (group && group.length > 0) {
          return 2;
        } else {
          return 1;
        }
      });

      setEnableUngrouping(isDataGrouped);
    } else {
      setEnableEdit(false);
      setEnableGrouping(false);
      setEnableDelete(false);
      setEnableUngrouping(false);
    }
  }, [data]);

  return {
    enableEdit,
    enableGrouping,
    enableDelete,
    enableUngrouping,
  };
};
