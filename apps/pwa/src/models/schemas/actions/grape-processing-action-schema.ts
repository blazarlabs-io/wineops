import { GrapeProcessingAction } from "@/models/types/actions";
import Joi from "joi";

export const grapeProcessingActionSchema = Joi.object<GrapeProcessingAction>({
  id: Joi.string().required(),
  batchId: Joi.string().required(),
  type: Joi.string().required(),
  quantity: Joi.number().precision(2).optional(),
  executionDate: Joi.date().required(),
  labReport: Joi.object({
    id: Joi.string().allow("").optional(),
    date: Joi.date().optional(),
    units: Joi.string().allow("").optional(),
    supportingDocs: Joi.array().items(Joi.string()).optional(),
    responsible: Joi.object({
      name: Joi.string().optional().allow(""),
      email: Joi.string().optional().allow(""),
    }).optional(),
    results: Joi.object({
      sugar: Joi.object({
        value: Joi.number().precision(2).optional(),
        variation: Joi.number().precision(2).optional(),
      }),
      acidity: Joi.object({
        value: Joi.number().precision(2).optional(),
        variation: Joi.number().precision(2).optional(),
      }),
    }).optional(),
  }).optional(),
  receivingBay: Joi.object().optional(),
  destemmer: Joi.object().optional(),
  press: Joi.object().optional(),
  pressPercentage: Joi.object({
    mustId: Joi.string().allow("").optional(),
    inputQuantity: Joi.number().precision(2).optional(),
    vessel: Joi.string().allow("").optional(),
    newPressPercentage: Joi.number().precision(2).optional(),
  }).optional(),
  wasteQuantity: Joi.number().optional(),
});
