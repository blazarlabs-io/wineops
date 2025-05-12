import { Vineyard } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useSortToolsBarStates = (data: Vineyard[]) => {
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [enableGrouping, setEnableGrouping] = useState<boolean>(false);
  const [enableDelete, setEnableDelete] = useState<boolean>(false);

  useEffect(() => {
    if (data && data !== undefined && data.length > 0) {
      if (data.length === 1) {
        setEnableEdit(true);
      } else {
        setEnableEdit(false);
      }
      setEnableGrouping(true);
      setEnableDelete(true);
    } else {
      setEnableEdit(false);
      setEnableGrouping(false);
      setEnableDelete(false);
    }
  }, [data]);

  return {
    enableEdit,
    enableGrouping,
    enableDelete,
  };
};
