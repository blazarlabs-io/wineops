import { VineyardHarvestAction } from "@/models/types/actions";
import Joi from "joi";

export const vineyardHarvestActionSchema = Joi.object<VineyardHarvestAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  subject: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }),
  supplier: Joi.string().required(),
  executionDate: Joi.date().required(),
  consumables: Joi.array().items(Joi.object()).optional(),
  batch: {
    id: Joi.string().optional().allow(""),
    quantity: Joi.number().precision(2).optional(),
  },
  invoiceNumber: Joi.string().optional().allow(""),
  latestLabData: Joi.object().optional(),
  vessels: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
      })
    )
    .optional(),
  equipment: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
      })
    )
    .optional(),
  description: Joi.string().allow(""),
  location: Joi.string().optional().allow(""),
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
