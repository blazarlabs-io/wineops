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
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }).optional(),
  consumables: Joi.array().items(Joi.object()).optional(),
  equipment: Joi.array().items(Joi.object()).optional(),
  inputData: Joi.object({
    sugar: Joi.number().precision(2).optional(),
    acidity: Joi.number().precision(2).optional(),
  }).optional(),
  notes: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        title: Joi.string().optional().allow(""),
        content: Joi.string().optional().allow(""),
      })
    )
    .optional(),
  supportingDocuments: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
        fileUrl: Joi.string().optional().allow(""),
      })
    )
    .optional(),
});
