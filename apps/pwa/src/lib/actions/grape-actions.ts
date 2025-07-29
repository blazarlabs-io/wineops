import {
  Grape,
  GrapeStatus,
  Must,
  MustStatus,
  RowType,
} from "@/models/types/db";
import { db } from "../firebase/services";
import { enqueueSnackbar } from "notistack";
import {
  ActionRelation,
  GrapeIntakeAction,
  PressPercentage,
} from "@/models/types/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const grapeIntakeAction = async (
  uid: string,
  actionData: GrapeIntakeAction,
  grape: Grape
) => {
  console.log("grapeIntakeAction", uid, actionData, grape);

  // * 1. write new action object into DB andreference it in the grape

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  // * 2. update grape object into DB

  const {
    id,
    qualityCharacteristics,
    labTechnicianName = "",
    labCertificateId = "",
    mass,
    weigherName,
    executionDate,
    invoiceNumber,
    transportInfo,
    certificatDeInofensivitate,
    supplier,
  } = actionData;

  const { gross = "", tare = "", net = "" } = mass || {};
  const { companyName, vehicleId, driverId } = transportInfo || {};

  const grapeRes = await db.grape.update(uid, grape.id, {
    actions: [
      ...(grape.actions || ([] as ActionRelation[])),
      {
        id,
        name: "grape-intake",
      },
    ],
    status: GrapeStatus.RECEIVED,
    metrics: { ...grape.metrics, actual: net },
    entry: {
      ...grape?.entry,
      ...(gross && { grossWeight: gross }),
      ...(tare && { tareWeight: tare }),
      ...(net && { netWeight: net }),
      ...(weigherName?.name && { weigherName: weigherName?.name }),
      ...(executionDate && { intakeDate: executionDate }),
    },
    transportationInfo: {
      ...grape?.transportationInfo,
      ...(companyName && { companyName }),
      ...(vehicleId && { vehicleIdNo: vehicleId }),
      ...(driverId && { driverIdNo: driverId }),
      ...(certificatDeInofensivitate && {
        certificate: certificatDeInofensivitate,
        ...(invoiceNumber && { acquisitionInvoiceNo: invoiceNumber }),
      }),
    },
    supplier: {
      ...grape?.supplier,
      ...(supplier?.companyName && { companyName: supplier?.companyName }),
    },
    labData: {
      ...grape?.labData,
      id: crypto.randomUUID(),
      sugar: {
        unit: "g/dm³",
        value: qualityCharacteristics?.sugar,
      },
      acidity: {
        unit: "g/dm³",
        value: qualityCharacteristics?.acidity || "",
      },
      density: {
        unit: "kg/L",
        value: qualityCharacteristics?.density,
      },
      temperature: {
        unit: "°C",
        value: qualityCharacteristics?.temperature,
      },
      spoiledGrapesPercentage: qualityCharacteristics?.massFractionSpoiled,
      crushedGrapesPercentage: qualityCharacteristics?.massFractionCrushed,
      addedGrapesVarietiesPercentage: qualityCharacteristics?.massFractionMixed,
      ...(labTechnicianName && { labTechnicianName: labTechnicianName }),
      ...(labCertificateId && { labCertificateID: labCertificateId }),
    },
  });

  if (grapeRes.status === 200) {
    enqueueSnackbar("Grape updated", { variant: "success" });
  } else {
    enqueueSnackbar("Error updating grape", { variant: "error" });
  }
};

export const grapeProcessingAction = async (
  uid: string,
  actionData: any,
  grape: Grape
) => {
  // * 1. write new action object into DB andreference it in the grape
  console.log(
    "\n\nXXXXXXXXXXXXXXXXgrapeProcessingAction",
    uid,
    actionData,
    grape
  );

  const actionRes = await db.action.create(uid, actionData);

  if (actionRes.status === 200) {
    enqueueSnackbar("Action created", { variant: "success" });
  } else {
    enqueueSnackbar("Error creating action", { variant: "error" });
  }

  // * 2. update grape object into DB
  const grapeRes = await db.grape.update(uid, grape.id, {
    actions: [
      ...(grape.actions || ([] as ActionRelation[])),
      {
        id: actionData.id,
        name: "grape-process",
      },
    ],
    status: GrapeStatus.PROCESSED,
    metrics: {
      ...grape.metrics,
      actual: (grape.metrics?.actual || 0) - (actionData.quantity || 0),
      supply: 0,
      demand: 0,
    },
  });

  if (grapeRes.status === 200) {
    enqueueSnackbar("Grape updated", { variant: "success" });
  } else {
    enqueueSnackbar("Error updating grape", { variant: "error" });
  }

  if (Array.isArray(actionData.pressPercentage)) {
    actionData.pressPercentage.map(async (press: PressPercentage) => {
      // // * 3. create a new must
      const newMust: Must = {
        id: Date.now().toString(),
        name: press?.mustId,
        date: actionData.executionDate,
        group: [press?.mustId],
        rowType: RowType.ITEM,
        // grapeVariety: grape?.grapeVariety,
        status: MustStatus.NEW_MUST,
        metrics: {
          actual: press?.inputQuantity,
          supply: 0,
          demand: 0,
        },
        labData: actionData.labReport,
        vessels: press?.vessels,
      };

      console.log("NEW MUST", newMust);
      const mustRes = await db.must.create(uid, newMust);

      if (mustRes.status === 200) {
        enqueueSnackbar("Must created", { variant: "success" });
      } else {
        enqueueSnackbar("Error creating must", { variant: "error" });
      }
    });
  }
};
