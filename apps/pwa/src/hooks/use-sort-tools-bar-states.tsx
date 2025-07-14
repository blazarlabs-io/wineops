import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { usePinnedEntitiesStore } from "@/store/pinned-entities";
import { useEffect, useState } from "react";

export const useSortToolsBarStates = () => {
  const [enableAdd, setEnableAdd] = useState<boolean>(false);
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [enableGrouping, setEnableGrouping] = useState<boolean>(false);
  const [enableDelete, setEnableDelete] = useState<boolean>(false);
  const [enableUngrouping, setEnableUngrouping] = useState<boolean>(false);
  const [enablePinning, setEnablePinning] = useState<boolean>(false);
  const [pinningState, setPinningState] = useState<"pin" | "unpin" | null>(
    null
  );

  const selected = useSelectedEntitiesStore(({ selected }) => selected);
  const pinned = usePinnedEntitiesStore(({ pinned }) => pinned);

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

    const selectedPinnedCount = selected.filter((item) =>
      pinned.includes(item)
    ).length;
    const selectedUnpinnedCount = selected.length - selectedPinnedCount;

    if (selectedPinnedCount === 0 && selectedUnpinnedCount > 0) {
      setPinningState("pin");
    } else if (selectedPinnedCount > 0 && selectedUnpinnedCount === 0) {
      setPinningState("unpin");
    } else if (selectedPinnedCount > 0 && selectedUnpinnedCount > 0) {
      setPinningState("pin");
    } else {
      setPinningState(null);
    }
  }, [selected]);

  return {
    enableAdd,
    enableEdit,
    enableGrouping,
    enableDelete,
    enableUngrouping,
    enablePinning,
    pinningState,
  };
};
