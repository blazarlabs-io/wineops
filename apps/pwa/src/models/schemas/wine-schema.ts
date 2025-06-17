"use strict";

import Joi from "joi";
import { Timestamp } from "firebase/firestore";
import { labElementSchema } from "./lab-element-schema";

const labDataSchema = Joi.object({
  date: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      })
    )
    .messages({
      "alternatives.types": "Date must be a valid date.",
    }),
  temperature: labElementSchema.optional(),
  alcohol: labElementSchema.optional(),
  sugar: labElementSchema.optional(),
  acidity: labElementSchema.optional(),
  volatileAcidity: labElementSchema.optional(),
  totalSO2: labElementSchema.optional(),
  freeSO2: labElementSchema.optional(),
  labTechnicianName: Joi.string().optional().allow(""),
  labCertificateID: Joi.string().optional().allow(""),
});

const wineVesselSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  qty: Joi.number().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Please enter a quantity for this vessel",
  }),
});

const grapeVarietySchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  percentage: Joi.number().min(1).required().messages({
    "number.base": "Percentage must be a number",
    "number.min": "Percentage must be at least 1",
    "any.required": "Please enter a percentage for this grape variety",
  }),
});

export const wineSchema = Joi.object({
  id: Joi.string().required(),
  rowType: Joi.string().optional(),
  group: Joi.array().items(Joi.string().optional().allow("")),
  date: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      })
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),
  name: Joi.string().required().messages({
    "any.required": "The wine name is required.",
    "string.base": "The wine name must be a string.",
    "string.empty": "The wine name cannot be empty.",
  }),
  supplier: Joi.object({
    companyName: Joi.string().optional().allow(""),
    dispatchInvoice: Joi.string().optional().allow(""),
    invoiceNo: Joi.string().optional().allow(""),
    vineyardName: Joi.string().optional().allow(""),
  }).optional(),
  grapeVariety: Joi.string().optional().allow(""),
  grapeVarieties: Joi.array().items(grapeVarietySchema).required().messages({
    "any.required": "At least one grape variety must be provided.",
  }),
  qty: Joi.number().required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number",
  }),
  vessels: Joi.array().items(Joi.object()).required().messages({
    "any.required": "At least one vessel must be provided.",
  }),
  safetyCertificateNo: Joi.string().optional().allow(""),
  invoicePurchaseNo: Joi.string().optional().allow(""),
  labData: labDataSchema.optional(),
  status: Joi.string().optional().allow(""),
});
