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
  }, "Timestamp validation"),
);

const sugarSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number()
    .precision(2)
    .min(0.01)
    .max(10_000_000)
    .required()
    .messages({
      "any.required": "Please enter a valid number for the sugar",
      "number.empty": "Please enter a valid number for the sugar",
      "number.base": "Please enter a valid number for the sugar",
      "number.precision": "Sugar must have at most 2 decimal places",
      "number.min": "Sugar must be greater than 0 g/dm³",
      "number.max": "Sugar cannot exceed 10,000,000 g/dm³",
    }),
  variation: Joi.number().precision(2).optional(),
  unit: Joi.string().optional().allow(""),
  responsible: Joi.object({
    id: Joi.string().optional().allow(""),
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }),
  date: TimestampOrString.optional().allow(""),
});

const aciditySchema = Joi.object({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  value: Joi.number()
    .precision(2)
    .min(0)
    .max(10000)
    .optional()
    .allow("")
    .messages({
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
  id: Joi.string().required(),
  type: Joi.string().required(),
  subject: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": "Please select a vineyard",
      "string.empty": "Please select a vineyard",
    }),
  executionDate: TimestampOrString.required().messages({
    "any.required": "Please select a date",
    "alternatives.types": "Date must be a valid date.",
  }),
  batchId: Joi.string()
    .min(2)
    .max(50)
    .custom((value, helpers) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return helpers.error("string.empty");
      if (trimmed.length < 2) return helpers.error("string.min");
      if (trimmed.length > 50) return helpers.error("string.max");

      return trimmed;
    })
    .required()
    .messages({
      "any.required": "Please enter a Batch ID",
      "string.empty": "Please enter a Batch ID",
      "string.min": "Batch ID must be at least 2 characters long",
      "string.max": "Batch ID must be less than or equal to 50 characters long",
    }),
  weight: Joi.number().min(0).max(1_000_000).required().messages({
    "any.required": "Please enter a valid number for the net weight",
    "number.empty": "Please enter a valid number for the net weight",
    "number.base": "Please enter a valid number for the net weight",
  }),
  responsible: teamMemberSchema,
  consumables: Joi.array()
    .items({
      id: Joi.string().allow("").optional(),
      name: Joi.string().allow("").optional(),
      qty: Joi.number().precision(2).optional(),
      stockConsumableQty: Joi.number().precision(2).optional(),
    })
    .optional(),
  equipment: Joi.array().items(relationSchema).optional(),
  location: Joi.string().optional().allow(""),
  invoiceNumber: Joi.string().optional().allow(""),
  transportCompanyName: Joi.string().optional().allow(""),
  transportVehicleId: Joi.string().optional().allow(""),
  transportDriverName: Joi.string().optional().allow(""),
  sugar: sugarSchema.required(),
  acidity: aciditySchema.optional(),
  certificateOfInofensivitate: Joi.string()
    .min(2)
    .max(250)
    .required()
    .messages({
      "any.required": "Please enter the certificat de inofensivitate ID",
      "string.empty": "Please enter the certificat de inofensivitate ID",
      "string.min":
        "Certificat de inofensivitate ID must be at least 2 characters long",
      "string.max":
        "Certificat de inofensivitate ID must be less than or equal to 50 characters long",
    }),
  description: Joi.string().allow("").max(250).messages({
    "string.max":
      "Description must be less than or equal to 250 characters long",
  }),
  supportingDocuments: Joi.array()
    .items({
      name: Joi.string().optional().allow(""),
      url: Joi.string().optional().allow(""),
    })
    .optional(),
  harvestEnded: Joi.boolean().default(false).optional(),
  latestVineyardLabReport: Joi.object({}).unknown(true).optional(),
});
