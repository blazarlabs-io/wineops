import { VineyardHarvestAction } from "@/models/types/actions";
import Joi from "joi";

export const vineyardHarvestActionSchema = Joi.object<VineyardHarvestAction>({
  id: Joi.string().required(),
  subject: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
      })
    )
    .required(),
  name: Joi.string().required(),
  executionDate: Joi.date().required(),
  consumables: Joi.array().items(Joi.object()).optional(),
  batchId: Joi.string().optional(),
  quantity: Joi.object({
    actual: Joi.number().optional(),
    supply: Joi.number().optional(),
    demand: Joi.number().optional(),
    status: Joi.string().optional().allow(""),
  }).optional(),
  invoiceNumber: Joi.string().optional().allow(""),
  latestLabData: Joi.object().optional(),
  vessels: Joi.array().items(Joi.object()).optional(),
  equipment: Joi.array().items(Joi.object()).optional(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  documents: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
        fileUrl: Joi.string().optional().allow(""),
        owner: Joi.object({
          name: Joi.string().optional().allow(""),
          email: Joi.string().optional().allow(""),
        }),
        uploadDate: Joi.string().optional().allow(""),
        media: Joi.object({
          type: Joi.string().optional().allow(""),
          subtype: Joi.string().optional().allow(""),
          sizeMb: Joi.number().precision(2).optional(),
        }),
      })
    )
    .optional(),
});
