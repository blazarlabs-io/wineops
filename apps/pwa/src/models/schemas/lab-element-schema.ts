"use strict";

import Joi from "joi";

export const labElementSchema = Joi.object({
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
