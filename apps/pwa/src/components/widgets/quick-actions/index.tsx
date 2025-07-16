/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GrapeActions,
  VineyardActions,
  VineyardSingleAction,
  WineActions,
  WineSingleAction,
} from "@/models/types/actions";
import { useCallback, useEffect, useState } from "react";
import QuickActionsWidgetStepOne from "./step-one";
import QuickActionsWidgetStepTwo from "./step-two";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";

export interface QuickActionsWidgetProps {
  actions?: any;
  onClick: (action: string) => void;
  dashboard?: string;
}

export default function QuickActionsWidget({
  actions,
  onClick,
  dashboard,
}: QuickActionsWidgetProps) {
  const [step, setStep] = useState(1);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [formTitle, setFormTitle] = useState<string>("");

  const handleActionClick = useCallback(
    (action: string) => {
      const key = action.split(" ").join("-");
      const selected = actions[key];
      console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      console.log("ACTION CLICKED", action);
      console.log("KEY", key);
      console.log("SELECTED", selected);
      console.log("ACTIONS", actions);
      console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      onClick(action);
      setSelectedAction(() => actions[action.split(" ").join("-")]);
      setFormTitle(selected?.title ?? `${action} action`);
      setStep(2);
    },
    [actions, onClick]
  );

  const handleBackClick = useCallback(() => {
    setStep(1);
  }, []);

  return (
    <div
      className="w-full h-full overflow-y-hidden"
      style={{
        minWidth: RIGHT_DRAWER_WIDTH,
        maxWidth: RIGHT_DRAWER_WIDTH,
        backgroundColor: "var(--mui-palette-background-default)",
      }}
    >
      {step === 1 && (
        <>
          {dashboard === "vineyards" && (
            <QuickActionsWidgetStepOne<VineyardActions>
              actions={actions}
              onClick={handleActionClick}
            />
          )}
          {dashboard === "grapes" && (
            <QuickActionsWidgetStepOne<GrapeActions>
              actions={actions}
              onClick={handleActionClick}
            />
          )}
          {dashboard === "primary-vinification" && (
            <QuickActionsWidgetStepOne<VineyardActions>
              actions={actions}
              onClick={handleActionClick}
            />
          )}
          {dashboard === "secondary-vinification" && (
            <QuickActionsWidgetStepOne<WineActions>
              actions={actions}
              onClick={handleActionClick}
            />
          )}
        </>
      )}
      {step === 2 && (
        <>
          {dashboard === "vineyards" && (
            <QuickActionsWidgetStepTwo<VineyardSingleAction>
              title={formTitle}
              selectedAction={selectedAction}
              onBackClick={handleBackClick}
            />
          )}
          {dashboard === "grapes" && (
            <QuickActionsWidgetStepTwo<VineyardSingleAction>
              title={formTitle}
              selectedAction={selectedAction}
              onBackClick={handleBackClick}
            />
          )}
          {dashboard === "primary-vinification" && (
            <QuickActionsWidgetStepTwo<VineyardSingleAction>
              title={formTitle}
              selectedAction={selectedAction}
              onBackClick={handleBackClick}
            />
          )}
          {dashboard === "secondary-vinification" && (
            <QuickActionsWidgetStepTwo<WineSingleAction>
              title={formTitle}
              selectedAction={selectedAction}
              onBackClick={handleBackClick}
            />
          )}
        </>
      )}
    </div>
  );
}
