import { CONCENTRATION_UNITS } from "@/data/constants";
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
import { enqueueSnackbar } from "notistack";
import { db } from "../firebase/services";

export const vineyardHarvestAction = async (
  uid: string,
  actionData: VineyardHarvestAction,
  vineyard: Vineyard,
) => {
  const newGrapeId = crypto.randomUUID();

  const updatedVineyard: Vineyard = {
    ...vineyard,
    status: actionData.harvestEnded
      ? VineyardStatus.HARVEST_ENDED
      : VineyardStatus.HARVESTING,
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
        id: newGrapeId,
        name: actionData.batchId,
      },
    ],
  };

  const vineyardRes = await db.vineyard.update(uid, vineyard.id, {
    ...updatedVineyard,
  });

  if (vineyardRes.status === 200) {
    enqueueSnackbar("Vineyard status updated", { variant: "success" });
  } else {
    enqueueSnackbar("Vineyard status update failed", { variant: "error" });
  }

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  const latestResults = actionData?.latestVineyardLabReport?.results;
  const latestResultsDate = actionData?.latestVineyardLabReport?.date;

  const labDate =
    latestResults &&
    latestResultsDate &&
    latestResults?.sugar?.value === actionData.sugar.value &&
    (latestResults?.acidity?.value === actionData?.acidity?.value ||
      !actionData?.acidity?.value)
      ? latestResultsDate
      : actionData.executionDate;

  const newBatch: Grape = {
    id: newGrapeId,
    name: actionData.batchId,
    date: actionData.executionDate,
    group: [actionData.batchId],
    location: actionData.location || "",
    rowType: "item",
    supplier: {
      companyName: "",
      invoiceNo: "",
      vineyardName: actionData.subject.name,
    },
    entry: {
      grossWeight: 0,
      grossUnit: "kg",
      netWeight: actionData.weight as number,
      netUnit: "kg",
      tareWeight: 0,
      tareUnit: "kg",
      weigherName: "",
      intakeDate: "",
    },
    status: "In Transit",
    grapeVariety: vineyard.grapeVariety,
    certifications: vineyard.info.certifications,

    labData: {
      date: labDate,
      sugar: {
        value: actionData.sugar.value,
        unit: actionData.sugar.unit,
      },
      acidity: {
        value: actionData?.acidity?.value,
        unit: actionData?.acidity?.unit,
      },
      density: "",
      temperature: "",
      spoiledGrapesPercentage: 0,
      crushedGrapesPercentage: 0,
      addedGrapesVarietiesPercentage: 0,
      labTechnicianName: "",
      labCertificateID: "",
    } as GrapeLabData,
    notes: [],
    transportationInfo: {
      id: "",
      vehicleIdNo: actionData.transportVehicleId as string,
      companyName: actionData.transportCompanyName as string,
      driverIdNo: actionData.transportDriverName as string,
      certificate: actionData?.certificateOfInofensivitate ?? "",
      acquisitionInvoiceNo: actionData.invoiceNumber ?? "",
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
      actual: actionData.weight as number,
    },
  };

  const createRes: DbResponse = await db.grape.create(uid, newBatch);

  if (createRes.status === 200) {
    enqueueSnackbar(`Grape batch ${actionData.batchId} created successfully`, {
      variant: "success",
    });
  } else {
    enqueueSnackbar(`Error creating grape batch ${actionData.batchId}`, {
      variant: "error",
    });
  }
};

export const vineyardLabAction = async (
  uid: string,
  actionData: VineyardGlobalAction,
  vineyard: Vineyard,
) => {
  const labReportId = Date.now().toString();

  const {
    id,
    inUseVineyard,
    labDataToDeleteIds = [],
    responsible,
    executionDate,
    supportingDocuments,
    inputData,
  } = actionData;

  if (Array.isArray(labDataToDeleteIds) && labDataToDeleteIds.length > 0) {
    const deleteRes = await db.labReport.deleteMany(uid, labDataToDeleteIds);
  }

  const labRes = await db.labReport.create(uid, {
    id: labReportId,
    units: CONCENTRATION_UNITS,
    ...(responsible && {
      responsible: {
        name: responsible?.name,
        email: responsible?.email,
      },
    }),
    date: executionDate,
    supportingDocuments,
    results: {
      sugar: {
        value: inputData?.sugar,
      },
      acidity: {
        value: inputData?.acidity,
      },
    },
  });

  if (labRes.status === 200) {
    enqueueSnackbar("Lab report created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating lab report", { variant: "error" });
  }

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  const filteredLabData =
    (Array.isArray(labDataToDeleteIds) && labDataToDeleteIds.length > 0
      ? vineyard.labData?.filter(
          (labData) => !labDataToDeleteIds?.includes(labData.id),
        )
      : vineyard.labData) || ([] as ActionRelation[]);

  const vineyardRes = await db.vineyard.update(uid, inUseVineyard.id, {
    actions: [
      ...(vineyard.actions || ([] as ActionRelation[])),
      {
        id,
        name: "lab-reports",
        date: executionDate,
      },
    ],
    labData: [
      ...filteredLabData,
      {
        id: labReportId,
        name: "lab-reports",
        date: executionDate,
      },
    ],
  });

  if (vineyardRes.status === 200) {
    enqueueSnackbar("Vineyard status updated", { variant: "success" });
  } else {
    enqueueSnackbar("Vineyard status update failed", { variant: "error" });
  }
};

export const vineyardGenericAction = async (
  uid: string,
  actionData: VineyardGlobalAction,
  vineyard: Vineyard,
) => {
  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar(
      `Action "${actionData.type?.split("-").join(" ")}" created`,
      { variant: "success" },
    );
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  const vineyardRes = await db.vineyard.update(
    uid,
    actionData.inUseVineyard.id,
    {
      actions: [
        ...(vineyard.actions || ([] as ActionRelation[])),
        {
          id: actionData.id,
          name: actionData.type,
        },
      ],
    },
  );

  if (vineyardRes.status === 200) {
    enqueueSnackbar("Vineyard status updated", { variant: "success" });
  } else {
    enqueueSnackbar("Vineyard status update failed", { variant: "error" });
  }
};
