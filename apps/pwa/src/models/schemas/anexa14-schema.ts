"use strict";

import Joi from "joi";
import { Timestamp } from "firebase/firestore";
import { GrapeDestination, ParcelClassification } from "../types/reports";

export const anexa14Schema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  date: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      }),
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),
  declarant: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "The name is required.",
      "string.base": "The name must be a string.",
      "string.empty": "The name cannot be empty.",
    }),
    wineRegisterUniqueId: Joi.string().optional().allow(""),
    identityCardNo: Joi.string().optional().allow(""),
    address: Joi.string().optional().allow(""),
    telFax: Joi.string().optional().allow(""),
  }).optional(),
  harvest: Joi.object({
    unit: Joi.string().optional().allow(""),
    totalVineyardsArea: Joi.number().min(0).max(1_000_000).optional().messages({
      "any.required": "Please enter a valid number",
      "number.empty": "Please enter a valid number",
      "number.base": "Please enter a valid number",
    }),
    freshConsumption: Joi.number()
      .min(0)
      .max(1_000_000)
      .optional()
      .allow("")
      .messages({
        "any.required": "Please enter a valid number",
        "number.empty": "Please enter a valid number",
        "number.base": "Please enter a valid number",
      }),
  }).optional(),
  parcelVineyards: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        vineyardId: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
        surface: Joi.number().optional().empty("").messages({
          "number.base": "Surface must be a number",
        }),
        parcelCode: Joi.string().optional().allow(""),
        grapeVariety: Joi.string().optional().allow(""),
        totalHarvestedQty: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        totalHarvestedQtyWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        unit: Joi.string().optional().allow(""),
        parcelClassification: Joi.string()
          .valid(...Object.values(ParcelClassification))
          .optional()
          .messages({
            "any.required": "Classification is required.",
            "string.base": "Classification must be a string.",
            "any.only": `Classification must be one of the following: ${Object.values(ParcelClassification).join(", ")}.`,
          }),
        grapeDestination: Joi.string()
          .valid(...Object.values(GrapeDestination))
          .optional()
          .messages({
            "any.required": "Destination is required.",
            "string.base": "Destination must be a string.",
            "any.only": `Destination must be one of the following: ${Object.values(GrapeDestination).join(", ")}.`,
          }),
        wine: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        wineWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        delivered: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        deliveredWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        deliveredMust: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        deliveredMustWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        sold: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        soldWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        soldMust: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        soldMustWhite: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
        other: Joi.number().optional().empty("").messages({
          "number.base": "Quantity must be a number",
        }),
      }).optional(),
    )
    .optional(),
  modifications: Joi.array().items(Joi.object().optional()).optional(),
  createdAt: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      }),
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),
  createdBy: Joi.string().required(),
  modifiedAt: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      }),
    )
    .optional(),
  modifiedBy: Joi.string().optional(),
});
