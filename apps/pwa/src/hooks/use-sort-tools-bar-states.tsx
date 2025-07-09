import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useEffect, useState } from "react";

export const useSortToolsBarStates = () => {
  const [enableAdd, setEnableAdd] = useState<boolean>(false);
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [enableGrouping, setEnableGrouping] = useState<boolean>(false);
  const [enableDelete, setEnableDelete] = useState<boolean>(false);
  const [enableUngrouping, setEnableUngrouping] = useState<boolean>(false);
  const [enablePinning, setEnablePinning] = useState<boolean>(false);

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  useEffect(() => {
    setEnableAdd(selected?.length === 0);
    setEnableEdit(selected?.length === 1);
    setEnableGrouping(selected?.length > 0);
    setEnableDelete(selected?.length > 0);
    setEnablePinning(selected?.length > 0);

    const isDataGrouped = selected?.some(
      ({ group }) => Array.isArray(group) && group.length > 1
    );

    setEnableUngrouping(isDataGrouped);
  }, [selected]);

  return {
    enableAdd,
    enableEdit,
    enableGrouping,
    enableDelete,
    enableUngrouping,
    enablePinning,
  };
};
