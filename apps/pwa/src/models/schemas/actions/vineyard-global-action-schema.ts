import { VineyardGlobalAction } from "@/models/types/actions";
import Joi from "joi";
import { teamMemberSchema } from "../vineyard-schema";
import { relationSchema } from "./vineyard-harvest-action-schema";

export const vineyardGlobalActionSchema = Joi.object<VineyardGlobalAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: Joi.date().required(),
  inUseVineyard: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }),
  responsible: teamMemberSchema.required(),
  consumables: Joi.array()
    .items({
      id: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      qty: Joi.number().precision(2).required(),
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
});
