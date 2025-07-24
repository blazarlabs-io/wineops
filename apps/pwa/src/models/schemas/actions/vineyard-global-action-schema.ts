import { VineyardGlobalAction } from "@/models/types/actions";
import Joi from "joi";
import { teamMemberSchema } from "../vineyard-schema";
import { relationSchema } from "./vineyard-harvest-action-schema";
import { TimestampOrString } from "../grape-schema";

export const vineyardGlobalActionSchema = Joi.object<VineyardGlobalAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: TimestampOrString.required().messages({
    "any.required": "Please select a date",
    "string.empty": "Please select a date",
    "alternatives.types": "Date must be a valid date.",
  }),
  inUseVineyard: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": "Please select a vineyard",
      "string.empty": "Please select a vineyard",
    }),
  responsible: teamMemberSchema,
  chemistry: Joi.array()
    .items({
      id: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      qty: Joi.number().precision(2).required(),
      stockChemistryQty: Joi.number().precision(2).optional(),
    })
    .optional(),
  consumables: Joi.array()
    .items({
      id: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      qty: Joi.number().precision(2).required(),
      stockConsumableQty: Joi.number().precision(2).optional(),
    })
    .optional(),
  equipment: Joi.array().items(relationSchema).optional(),
  inputData: Joi.object({
    sugar: Joi.number().precision(2).optional().messages({
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
  aditionalInformation: Joi.string().optional().allow(""),
  createdAt: TimestampOrString.empty("").optional(),
  createdBy: Joi.string().optional().allow(""),
});
