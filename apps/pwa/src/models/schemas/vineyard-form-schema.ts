"use strict";

import { Vineyard } from "@/models/types/db";
import Joi from "joi";
import {
  locationSchema,
  vinesSchema,
  vineyardCertificationsSchema,
  vineyardGrapeSchema,
} from "./vineyard-schema";
import { vineyardValidationMessages } from "./vineyard-validation-messages";

const vineyardInfoFormSchema = Joi.object({
  location: locationSchema,
  vines: vinesSchema,
  certifications: vineyardCertificationsSchema,
});

export const vineyardFormSchema = Joi.object<Partial<Vineyard>>()
  .unknown(true)
  .keys({
    id: Joi.string().required(),
    name: Joi.string()
      .max(50)
      .required()
      .messages(vineyardValidationMessages.name),
    grapeVariety: Joi.string()
      .max(50)
      .required()
      .messages(vineyardValidationMessages.grapeVariety),
    grapeColor: Joi.string()
      .max(50)
      .required()
      .messages(vineyardValidationMessages.grapeColor),
    cadastralNumber: Joi.array().items(
      Joi.string()
        .min(2)
        .max(50)
        .optional()
        .allow("")
        .messages(vineyardValidationMessages.cadastralNumber),
    ),
    identificatorUnicParcela: Joi.array().items(
      Joi.string()
        .min(2)
        .max(50)
        .optional()
        .allow("")
        .messages(vineyardValidationMessages.identificatorUnicParcela),
    ),
    rowType: Joi.string().optional(),
    info: vineyardInfoFormSchema,
    grape: vineyardGrapeSchema.optional(),
    status: Joi.string().optional(),
    forecastedYield: Joi.number().empty("").default(1),
    tasks: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().optional().allow(""),
          name: Joi.string().optional().allow(""),
        }),
      )
      .optional(),
    notes: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().optional().allow(""),
          name: Joi.string().optional().allow(""),
        }),
      )
      .optional(),
    documents: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().optional().allow(""),
          name: Joi.string().optional().allow(""),
          fileUrl: Joi.string().optional().allow(""),
        }),
      )
      .optional(),
    group: Joi.array().items(Joi.string().optional().allow("")).optional(),
    batches: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().optional().allow(""),
          name: Joi.string().optional().allow(""),
        }),
      )
      .optional(),
  });
