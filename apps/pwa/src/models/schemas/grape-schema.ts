"use strict";

import { Timestamp } from "firebase/firestore";
import Joi from "joi";

const labElementSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number().precision(2).optional().empty("").messages({
    "number.base": "Must be a number",
  }),
  variation: Joi.number().precision(2).optional().empty("").messages({
    "number.base": "Must be a number",
  }),
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
  grossWeight: Joi.number().optional().empty("").messages({
    "number.base": "Gross weight must be a number",
  }),
  grossUnit: Joi.string().optional().allow(""),
  netWeight: Joi.number().optional().empty("").messages({
    "number.base": "Net weight must be a number",
  }),
  netUnit: Joi.string().optional().allow(""),
  tareWeight: Joi.number().optional().empty("").messages({
    "number.base": "Tare weight must be a number",
  }),
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
  spoiledGrapesPercentage: Joi.number().optional().empty("").messages({
    "number.base":
      "Mass fraction of grapes affected by disease must be a number",
  }),
  crushedGrapesPercentage: Joi.number().optional().empty("").messages({
    "number.base": "Mass fraction of crushed grapes must be a number",
  }),
  addedGrapesVarietiesPercentage: Joi.number().optional().empty("").messages({
    "number.base": "Mass fraction of mixed grape varieties must be a number",
  }),
  labTechnicianName: Joi.string().optional().allow(""),
  labCertificateID: Joi.string().optional().allow(""),
});

export const grapeSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required().messages({
    "any.required": "Product name is required.",
    "string.base": "Product name must be a string.",
    "string.empty": "Product name cannot be empty.",
  }),
  rowType: Joi.string().optional(),
  group: Joi.array().items(Joi.string().optional().allow("")),
  date: TimestampOrString.required().messages({
    "any.required": "Date is required.",
    "string.base": "Date must be a string.",
    "string.empty": "Date cannot be empty.",
  }),
  grapeVariety: Joi.string().required().messages({
    "any.required": "Grape variet is required.",
    "string.base": "Grape variety must be a string.",
    "string.empty": "Grape variety cannot be empty.",
  }),
  supplier: supplierSchema.optional(),
  entry: entrySchema.optional(),
  transportationInfo: transportationInfoSchema,
  labData: grapeLabDataSchema,
});
