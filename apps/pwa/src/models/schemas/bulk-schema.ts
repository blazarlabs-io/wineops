"use strict";

import Joi from "joi";
import { Timestamp } from "firebase/firestore";

export const bulkSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required().messages({
    "any.required": "The bulk name is required.",
    "string.base": "The bulk name must be a string.",
    "string.empty": "The bulk name cannot be empty.",
  }),
  rowType: Joi.string().optional(),
  qty: Joi.number().required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number",
  }),
  startDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Start date must be a valid date.",
        "string.base": "Start date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Start date must be a valid date.",
      })
    )
    .required()
    .messages({
      "alternatives.types": "Start date must be a valid date.",
    }),
});
