"use strict";

import { Timestamp } from "firebase/firestore";
import Joi from "joi";

const labElementSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number().precision(2).optional(),
  variation: Joi.number().precision(2).optional(),
  unit: Joi.string().optional().allow(""),
  responsible: Joi.object({
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }),
  date: Joi.string().optional().allow(""),
});

const TimestampOrString = Joi.alternatives().try(
  Joi.string().isoDate(),
  Joi.object().custom((value, helpers) => {
    if (value instanceof Timestamp) return value;
    return helpers.error("any.invalid");
  }, "Timestamp validation")
);

const supplierSchema = Joi.object({
  companyName: Joi.string().optional().allow(""),
  dispatchInvoice: Joi.string().optional().allow(""),
  invoiceNo: Joi.string().optional().allow(""),
  vineyardName: Joi.string().optional().allow(""),
});

const entrySchema = Joi.object({
  grossWeight: Joi.number().optional(),
  grossUnit: Joi.string().optional().allow(""),
  netWeight: Joi.number().optional(),
  netUnit: Joi.string().optional().allow(""),
  tareWeight: Joi.number().optional(),
  tareUnit: Joi.string().optional().allow(""),
  weigherName: Joi.string().optional().allow(""),
  intakeDate: TimestampOrString,
});

const transportationInfoSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  vehicleIdNo: Joi.string().optional().allow(""),
  companyName: Joi.string().optional().allow(""),
  driverIdNo: Joi.string().optional().allow(""),
  certificate: Joi.string().optional().allow(""),
  acquisitionInvoiceNo: Joi.string().optional().allow(""),
});

const grapeLabDataSchema = Joi.object({
  date: TimestampOrString,
  sugar: labElementSchema,
  acidity: labElementSchema,
  density: labElementSchema,
  temperature: labElementSchema,
  spoiledGrapesPercentage: Joi.number().optional(),
  crushedGrapesPercentage: Joi.number().optional(),
  addedGrapesVarietiesPercentage: Joi.number().optional(),
  labTechnicianName: Joi.string().optional().allow(""),
  labCertificateID: Joi.string().optional().allow(""),
});

export const grapeSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  rowType: Joi.string().optional(),
  group: Joi.array().items(Joi.string().optional().allow("")),
  date: TimestampOrString,
  grapeVariety: Joi.string().optional(),
  supplier: supplierSchema.optional(),
  entry: entrySchema.optional(),
  transportationInfo: transportationInfoSchema,
  labData: grapeLabDataSchema,
});
