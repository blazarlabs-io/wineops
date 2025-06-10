import {
  ActionRelation,
  VineyardGlobalAction,
  VineyardHarvestAction,
} from "@/models/types/actions";
import {
  DbResponse,
  Grape,
  GrapeLabData,
  Vineyard,
  VineyardStatus,
} from "@/models/types/db";
import { Timestamp } from "firebase/firestore";
import { enqueueSnackbar } from "notistack";
import { db } from "../firebase/services";
import { CONCENTRATION_UNITS } from "@/data/constants";

export const vineyardHarvestAction = async (
  uid: string,
  actionData: VineyardHarvestAction,
  vineyard: Vineyard
) => {
  console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXX");
  console.log("UID", uid);
  console.log("vineyardHarvestAction", actionData);
  console.log("vineyard", vineyard);
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXX\n\n");

  const batchId = Date.now().toString();

  const updatedVineyard: Vineyard = {
    ...vineyard,
    status: VineyardStatus.HARVESTING,
    actions: [
      ...(vineyard.actions || ([] as ActionRelation[])),
      {
        id: actionData.id,
        name: "harvest",
      },
    ],
    batches: [
      ...(vineyard.batches || ([] as ActionRelation[])),
      {
        id: batchId,
        name: actionData.batch.id,
      },
    ],
  };

  console.log("UPDATED-VINEYARD", updatedVineyard);

  // * 1. Update Vineyard
  const vineyardRes = await db.vineyard.update(uid, vineyard.id, {
    ...updatedVineyard,
  });

  if (vineyardRes.status === 200) {
    enqueueSnackbar("Vineyard status updated", { variant: "success" });
  } else {
    enqueueSnackbar("Vineyard status update failed", { variant: "error" });
  }

  // * 2. Add Action
  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  // * 3. Add batch of grapes
  const newBatch: Grape = {
    id: batchId,
    name: actionData.batch.id,
    date: Timestamp.now(),
    group: [actionData.batch.id],
    location: actionData.location,
    rowType: "item",
    supplier: {
      companyName: actionData.supplier,
      dispatchInvoice: "",
      invoiceNo: actionData.invoiceNumber,
      vineyardName: actionData.subject.name,
    },
    entry: {
      grossWeight: 0,
      grossUnit: undefined,
      netWeight: 0,
      netUnit: undefined,
      tareWeight: 0,
      tareUnit: undefined,
      weigherName: "",
      intakeDate: "",
    },
    status: "In Transit",
    grapeVariety: vineyard.grapeVariety,
    certifications: vineyard.info.certifications,
    labData: {} as GrapeLabData,
    notes: [],
    transportationInfo: {
      id: "",
      vehicleIdNo: "",
      companyName: "",
      driverIdNo: "",
      certificate: "",
      acquisitionInvoiceNo: "",
    },
    processingInfo: {
      receivingBay: "",
      destemmer: "",
      pressUsed: "",
      vesselUsed: "",
    },
    tasks: [],
    documents: [],
    metrics: {
      actual: actionData.batch.quantity,
    },
  };

  const createRes: DbResponse = await db.grape.create(uid, newBatch);

  if (createRes.status === 200) {
    enqueueSnackbar(`Grape batch created successfully`, {
      variant: "success",
    });
  } else {
    enqueueSnackbar(`Error creating grape batch`, {
      variant: "error",
    });
  }
};

export const vineyardLabAction = async (
  uid: string,
  actionData: VineyardGlobalAction,
  vineyard: Vineyard
) => {
  console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXX");
  console.log("UID", uid);
  console.log("vineyardLabAction", actionData);
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXX\n\n");

  const labReportId = Date.now().toString();

  // * 1. write new lab object into DB andreference it in the vineyard
  const labRes = await db.labReport.create(uid, {
    id: labReportId,
    units: CONCENTRATION_UNITS,
    responsible: {
      name: actionData?.responsible?.name,
      email: actionData?.responsible?.email,
    },
    date: actionData.executionDate,
    suportingDocs: [],
    results: {
      sugar: {
        value: actionData.inputData?.sugar,
        variation: (Math.random() * 2 - 1).toFixed(2),
      },
      acidity: {
        value: actionData.inputData?.acidity,
        variation: (Math.random() * 2 - 1).toFixed(2),
      },
    },
    supportingDocs: [],
  });

  if (labRes.status === 200) {
    enqueueSnackbar("Lab report created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating lab report", { variant: "error" });
  }

  // * 2. Add Action
  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  // * 3. Update Vineyard
  const vineyardRes = await db.vineyard.update(
    uid,
    actionData.inUseVineyard.id,
    {
      actions: [
        ...(vineyard.actions || ([] as ActionRelation[])),
        {
          id: actionData.id,
          name: "lab-reports",
        },
      ],
      labData: [
        ...(vineyard.labData || ([] as ActionRelation[])),
        {
          id: labReportId,
          name: "lab-reports",
        },
      ],
    }
  );

  if (vineyardRes.status === 200) {
    enqueueSnackbar("Vineyard status updated", { variant: "success" });
  } else {
    enqueueSnackbar("Vineyard status update failed", { variant: "error" });
  }
};

export const vineyardIrrigationAction = async (
  uid: string,
  actionData: VineyardGlobalAction,
  vineyard: Vineyard
) => {
  console.log("\n\nXXXXXXXXXXXXXXXXXXXXXXXXX");
  console.log("UID", uid);
  console.log("vineyardIrrigationAction", actionData);
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXX\n\n");
};
