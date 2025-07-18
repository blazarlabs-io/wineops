"use strict";

import Joi from "joi";
import { Timestamp } from "firebase/firestore";
import { Anexa7Data, StockProductCategory } from "../types/reports";

export const anexa7Schema = Joi.object<Anexa7Data>({
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
  numarInregistrareBDUV: Joi.string().optional().allow(""),
  identificatorUnicUnitateVinicola: Joi.string().optional().allow(""),
  declarant: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "The name is required.",
      "string.base": "The name must be a string.",
      "string.empty": "The name cannot be empty.",
    }),
    idno_idnp: Joi.string().optional().allow(""),
    name2: Joi.string().optional().allow(""),
  }).optional(),
  stockProducts: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        category: Joi.string()
          .valid(...Object.values(StockProductCategory))
          .optional()
          .messages({
            "any.required": "Category is required.",
            "string.base": "Category must be a string.",
            "any.only": `Category must be one of the following: ${Object.values(StockProductCategory).join(", ")}.`,
          }),
        externalId: Joi.string().required().messages({
          "any.required": "The name is required.",
          "string.base": "The name must be a string.",
          "string.empty": "The name cannot be empty.",
        }),
        name: Joi.string().required().messages({
          "any.required": "The name is required.",
          "string.base": "The name must be a string.",
          "string.empty": "The name cannot be empty.",
        }),
        unit: Joi.string().optional().allow(""),
        total: Joi.number().required().messages({
          "number.base": "Please enter a valid number",
        }),
        red: Joi.number().optional().empty("").messages({
          "number.base": "Please enter a valid number",
        }),
        rose: Joi.number().optional().empty("").messages({
          "number.base": "Please enter a valid number",
        }),
        white: Joi.number().optional().empty("").messages({
          "number.base": "Please enter a valid number",
        }),
      }).optional()
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
      })
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),
  createdBy: Joi.string().optional().allow(""),
  modifiedAt: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      })
    )
    .optional(),
  modifiedBy: Joi.string().optional(),
});
