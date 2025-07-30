"use strict";

import Joi from "joi";
import { ChemistryType, StageOfProduction } from "../types/db";
import { Timestamp } from "firebase/firestore";

export const chemistrySchema = Joi.object({
  id: Joi.string().required(),
  orderDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Order date must be a valid date.",
        "string.base": "Order date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Order date must be a valid date.",
      }),
    )
    .required()
    .messages({
      "any.required": "Order date is required.",
      "alternatives.types": "Order date must be a valid date.",
    }),
  name: Joi.string().required().messages({
    "any.required": "The chemistry item name is required.",
    "string.base": "The chemistry item name must be a string.",
    "string.empty": "The chemistry item name cannot be empty.",
  }),
  chemistryID: Joi.string().optional().empty("").messages({
    "any.required": "The chemistry item ID is required.",
    "string.base": "The chemistry item ID must be a string.",
    "string.empty": "The chemistry item ID cannot be empty.",
  }),
  type: Joi.string()
    .valid(...Object.values(ChemistryType))
    .required()
    .messages({
      "any.required": "The chemistry item type is required.",
      "string.base": "The chemistry item type must be a string.",
      "any.only": `The chemistry item type must be one of the following: ${Object.values(ChemistryType).join(", ")}.`,
    }),
  qty: Joi.number().required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number",
  }),
  stageOfProduction: Joi.string()
    .valid(...Object.values(StageOfProduction))
    .optional()
    .allow("")
    .messages({
      "any.required": "The stage of production is required.",
      "string.base": "The stage of production must be a string.",
      "any.only": `The stage of production must be one of the following: ${Object.values(StageOfProduction).join(", ")}.`,
    }),
  rowType: Joi.string().optional(),
  minimumStockAlert: Joi.number().optional().empty("").messages({
    "number.base": "Minimum stock alert must be a number",
  }),
  dosage: Joi.string().optional().allow(""),
  recommendedDosage: Joi.number().optional().empty("").messages({
    "number.base": "Recommended dosage must be a number",
  }),
  maxDosage: Joi.number().optional().empty("").messages({
    "number.base": "Maximum admisible dosage must be a number",
  }),
  expiryDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Expiry date must be a valid date.",
        "string.base": "Expiry date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Expiry date must be a valid date.",
      }),
    )
    .optional()
    .allow("")
    .messages({
      "alternatives.types": "Expiry date must be a valid date.",
    }),
  invoiceNo: Joi.string().optional().allow(""),
  manufacturer: Joi.string().optional().allow(""),
  certificatCalitate: Joi.string().optional().allow(""),
  legalUseNotes: Joi.string().optional().allow(""),
  comments: Joi.string().optional().allow(""),
});
