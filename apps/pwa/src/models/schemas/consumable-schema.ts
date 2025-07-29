"use strict";

import Joi from "joi";
import { ConsumableCategory } from "../types/db";
import { Timestamp } from "firebase/firestore";

export const consumableSchema = Joi.object({
  id: Joi.string().required(),
  category: Joi.string()
    .valid(...Object.values(ConsumableCategory))
    .required()
    .messages({
      "any.required": "The consumable category is required.",
      "string.base": "The consumable category must be a string.",
      "any.only": `The consumable category must be one of the following: ${Object.values(ConsumableCategory).join(", ")}.`,
    }),
  name: Joi.string().required().messages({
    "any.required": "The consumable name is required.",
    "string.base": "The consumable name must be a string.",
    "string.empty": "The consumable name cannot be empty.",
  }),
  consumableID: Joi.string().required().messages({
    "any.required": "The consumable ID is required.",
    "string.base": "The consumable ID must be a string.",
    "string.empty": "The consumable ID cannot be empty.",
  }),
  rowType: Joi.string().optional(),
  qty: Joi.number().optional().empty("").messages({
    "number.base": "Quantity must be a number",
  }),
  minimumStockAlert: Joi.number().optional().empty("").messages({
    "number.base": "Minimum stock alert must be a number",
  }),
  manufacturer: Joi.string().optional().allow(""),
  certificatCalitate: Joi.string().optional().allow(""),
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
    .optional()
    .allow("")
    .messages({
      "alternatives.types": "Order date must be a valid date.",
    }),
  invoiceNo: Joi.string().optional().allow(""),
  specifications: Joi.string().optional().allow(""),
  storageHandlingNotes: Joi.string().optional().allow(""),
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
  organicBiodynamicStatus: Joi.boolean().optional().empty(""),
  compatibleEquipment: Joi.string().optional().allow(""),
});
