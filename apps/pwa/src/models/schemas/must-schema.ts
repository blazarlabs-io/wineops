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
  yeastActivityPopulation: labElementSchema.optional(),
  yeastAssimilableNitrogen: labElementSchema.optional(),
  labTechnicianName: Joi.string().optional().allow(""),
  labCertificateID: Joi.string().optional().allow(""),
});

export const mustSchema = Joi.object({
  id: Joi.string().required(),
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
    "any.required": "The batch name is required.",
    "string.base": "The batch name must be a string.",
    "string.empty": "The batch name cannot be empty.",
  }),
  rowType: Joi.string().optional(),
  supplier: Joi.object({
    companyName: Joi.string().optional().allow(""),
    dispatchInvoice: Joi.string().optional().allow(""),
    invoiceNo: Joi.string().optional().allow(""),
    vineyardName: Joi.string().optional().allow(""),
  }).optional(),
  grapeVariety: Joi.string().optional().allow(""),
  qty: Joi.number().optional().empty("").messages({
    "number.base": "Quantity must be a number",
  }),
  vessels: Joi.array().items(Joi.any()).optional().allow(null),
  safetyCertificateNo: Joi.string().optional().allow(""),
  invoicePurchaseNo: Joi.string().optional().allow(""),
  labData: labDataSchema.optional(),
});
