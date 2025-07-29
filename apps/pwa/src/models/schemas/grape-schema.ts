"use strict";

import { Timestamp } from "firebase/firestore";
import Joi from "joi";

export const TimestampOrString = Joi.alternatives().try(
  Joi.string().isoDate(),
  Joi.object().custom((value, helpers) => {
    if (value instanceof Timestamp) return value;
    return helpers.error("any.invalid");
  }, "Timestamp validation")
);

const supplierSchema = Joi.object({
  companyName: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter a supplier name",
    "string.empty": "Please enter a supplier name",
    "string.min": "Supplier name must be at least 2 characters long",
    "string.max":
      "Supplier name must be less than or equal to 50 characters long",
  }),
  invoiceNo: Joi.string().optional().allow(""),
  vineyardName: Joi.string().optional().allow(""),
});

const entrySchema = Joi.object({
  grossWeight: Joi.number().min(0).max(1_000_000).required().messages({
    "any.required": "Please enter a valid number for the gross weight",
    "number.empty": "Please enter a valid number for the gross weight",
    "number.base": "Please enter a valid number for the gross weight",
  }),
  netWeight: Joi.number().min(0).max(1_000_000).required().messages({
    "any.required": "Please enter a valid number for the net weight",
    "number.empty": "Please enter a valid number for the net weight",
    "number.base": "Please enter a valid number for the net weight",
  }),
  tareWeight: Joi.number().min(0).max(1_000_000).required().messages({
    "any.required": "Please enter a valid number for the tare weight",
    "number.empty": "Please enter a valid number for the tare weight",
    "number.base": "Please enter a valid number for the tare weight",
  }),
  weigherName: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter a weighbridge operator name",
    "string.empty": "Please enter a weighbridge operator name",
    "string.min":
      "Weighbridge operator name must be at least 2 characters long",
    "string.max":
      "Weighbridge operator name must be less than or equal to 50 characters long",
  }),
  intakeDate: TimestampOrString,
});

const transportationInfoSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  vehicleIdNo: Joi.string().optional().allow(""),
  companyName: Joi.string().optional().allow(""),
  driverIdNo: Joi.string().optional().allow(""),
  processingLocation: Joi.string().optional().allow(""),
  certificate: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter the certificat de inofensivitate ID",
    "string.empty": "Please enter the certificat de inofensivitate ID",
    "string.min":
      "Certificat de inofensivitate ID must be at least 2 characters long",
    "string.max":
      "Certificat de inofensivitate ID must be less than or equal to 50 characters long",
  }),
  acquisitionInvoiceNo: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter the invoice ID",
    "string.empty": "Please enter the invoice ID",
    "string.min": "SInvoice ID must be at least 2 characters long",
    "string.max": "Invoice ID must be less than or equal to 50 characters long",
  }),
});

const grapeLabDataSchema = Joi.object({
  date: TimestampOrString,
  density: Joi.object({
    value: Joi.number().min(0).max(1000).precision(2).required().messages({
      "any.required": "Please enter a valid number for the density",
      "number.empty": "Please enter a valid number for the density",
      "number.base": "Please enter a valid number for the density",
    }),
  }),
  temperature: Joi.object({
    value: Joi.number().min(0).max(1000).precision(2).required().messages({
      "any.required": "Please enter a valid number for the temperature",
      "number.empty": "Please enter a valid number for the temperature",
      "number.base": "Please enter a valid number for the temperature",
    }),
  }),
  sugar: Joi.object({
    value: Joi.number().min(0).max(1000).precision(2).required().messages({
      "any.required": "Please enter a valid number for the sugar",
      "number.empty": "Please enter a valid number for the sugar",
      "number.base": "Please enter a valid number for the sugar",
    }),
  }),
  acidity: Joi.object({
    value: Joi.number().min(0).max(1000).precision(2).required().messages({
      "any.required": "Please enter a valid number for the acidity",
      "number.empty": "Please enter a valid number for the acidity",
      "number.base": "Please enter a valid number for the acidity",
    }),
  }),
  spoiledGrapesPercentage: Joi.number().min(0).max(100).required().messages({
    "any.required": "Please enter a valid number for the affected grapes",
    "number.empty": "Please enter a valid number for the affected grapes",
    "number.base": "Please enter a valid number for the affected grapes",
  }),
  crushedGrapesPercentage: Joi.number().min(0).max(100).required().messages({
    "any.required": "Please enter a valid number for the crushed grapes",
    "number.empty": "Please enter a valid number for the crushed grapes",
    "number.base": "Please enter a valid number for the crushed grapes",
  }),
  addedGrapesVarietiesPercentage: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      "any.required": "Please enter a valid number for the mixed grapes",
      "number.empty": "Please enter a valid number for the mixed grapes",
      "number.base": "Please enter a valid number for the mixed grapes",
    }),
  labTechnicianName: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter a lab technician name",
    "string.empty": "Please enter a lab technician name",
    "string.min": "Lab technician name must be at least 2 characters long",
    "string.max":
      "Lab technician name must be less than or equal to 50 characters long",
  }),
  labCertificateID: Joi.string().optional().allow(""),
});

export const grapeSchema = Joi.object().keys({
  id: Joi.string().required(),
  rowType: Joi.string().optional(),
  group: Joi.array().items(Joi.string().optional().allow("")),
  date: TimestampOrString.required().messages({
    "any.required": "Please select date",
    "string.base": "Date must be a string",
    "string.empty": "Please select date",
  }),
  supplier: supplierSchema.required().messages({
    "any.required": "Please enter a supplier name",
    "string.base": "Supplier name must be a string",
    "string.empty": "Please enter a supplier name",
  }),
  name: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter a Batch ID",
    "string.base": "Batch ID must be a string",
    "string.empty": "Please enter a Batch ID",
    "string.min": "Batch ID name must be at least 2 characters long",
    "string.max": "Batch ID must be less than or equal to 50 characters long",
  }),
  grapeVariety: Joi.string().required().messages({
    "any.required": "Please enter a grape variety",
    "string.base": "Grape variety must be a string",
    "string.empty": "Please enter a grape variety",
  }),
  entry: entrySchema.required(),
  transportationInfo: transportationInfoSchema,
  labData: grapeLabDataSchema.required(),
  notes: Joi.array().items(Joi.object()).optional(),
  processingInfo: Joi.object().allow(null).optional(),
  tasks: Joi.array().items(Joi.object()).optional(),
  documents: Joi.array().items(Joi.object()).optional(),
  location: Joi.string().optional().allow(""),
  metrics: Joi.object().allow(null).optional(),
  status: Joi.string().optional().allow(""),
  certifications: Joi.object().allow(null).optional(),
  description: Joi.string().optional().allow(""),
});
