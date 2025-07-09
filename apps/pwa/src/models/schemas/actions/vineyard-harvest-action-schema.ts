import { VineyardHarvestAction } from "@/models/types/actions";
import Joi from "joi";
import { teamMemberSchema } from "../vineyard-schema";
import { Timestamp } from "firebase/firestore";

export const relationSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
});

const TimestampOrString = Joi.alternatives().try(
  Joi.string().isoDate(),
  Joi.object().custom((value, helpers) => {
    if (value instanceof Timestamp) return value;
    return helpers.error("any.invalid");
  }, "Timestamp validation")
);

const sugarSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number().precision(2).min(0).max(10000).optional().messages({
    "number.base": "Must be a number",
    "number.min": "Value must be at least 0",
    "number.max": "Value must be less than 10000",
  }),
  variation: Joi.number().precision(2).optional(),
  unit: Joi.string().optional().allow(""),
  responsible: Joi.object({
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }),
  date: TimestampOrString.optional().allow(""),
});

const aciditySchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number().precision(2).min(0).max(10000).optional().messages({
    "number.base": "Must be a number",
    "number.min": "Value must be at least 0",
    "number.max": "Value must be less than 10000",
  }),
  variation: Joi.number().precision(2).optional(),
  unit: Joi.string().optional().allow(""),
  responsible: Joi.object({
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }),
  date: TimestampOrString,
});

export const vineyardHarvestActionSchema = Joi.object<VineyardHarvestAction>({
  // * General info
  id: Joi.string().required(),
  type: Joi.string().required(),
  subject: Joi.object({
    id: Joi.string().allow("").required(),
    name: Joi.string().allow("").required(),
  }),
  executionDate: TimestampOrString.required().messages({
    "any.required": "Please select a date",
    "alternatives.types": "Date must be a valid date.",
  }),
  batchId: Joi.string().optional().allow(""),
  weight: Joi.number().optional(),
  responsible: teamMemberSchema.optional(),
  consumables: Joi.array()
    .items({
      id: Joi.string().allow("").optional(),
      name: Joi.string().allow("").optional(),
      qty: Joi.number().precision(2).optional(),
    })
    .optional(),
  equipment: Joi.array().items(relationSchema).optional(),
  //  * Transport info
  location: Joi.string().optional().allow(""),
  invoiceNumber: Joi.string().optional().allow(""),
  transportCompanyName: Joi.string().optional().allow(""),
  transportVehicleId: Joi.string().optional().allow(""),
  transportDriverName: Joi.string().optional().allow(""),
  // * Quality params
  sugar: sugarSchema.optional(),
  acidity: aciditySchema.optional(),
  certificateOfInofensiviate: Joi.string().optional().allow(""),
  // * Additional info
  description: Joi.string().allow("").max(250).messages({
    "string.max":
      "Description must be less than or equal to 250 characters long",
  }),
  harvestEnded: Joi.boolean().default(false).optional(),
});
