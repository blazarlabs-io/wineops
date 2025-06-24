import { VineyardGlobalAction } from "@/models/types/actions";
import Joi from "joi";

export const vineyardGlobalActionSchema = Joi.object<VineyardGlobalAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: Joi.date().required(),
  inUseVineyard: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }),
  responsible: Joi.object({
    name: Joi.string().required().allow("").messages({
      "any.required": "Name is required.",
      "string.base": "You must choose a name.",
      "string.empty": "Name cannot be empty.",
    }),
    email: Joi.string().allow(""),
  }).required(),
  consumables: Joi.array().items(Joi.object()).optional(),
  equipment: Joi.array().items(Joi.object()).optional(),
  inputData: Joi.object({
    sugar: Joi.number().precision(2).required().messages({
      "any.required": "Sugar is required.",
      "number.base": "Sugar must be a number.",
    }),
    acidity: Joi.number().precision(2).optional(),
  }).optional(),
  supportingDocuments: Joi.array()
    .items({
      name: Joi.string().optional().allow(""),
      url: Joi.string().optional().allow(""),
    })
    .optional(),
});
