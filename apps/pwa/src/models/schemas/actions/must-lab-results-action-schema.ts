import { MustLabResultsAction } from "@/models/types/actions";
import { Timestamp } from "firebase/firestore";
import Joi from "joi";
import { teamMemberSchema } from "../vineyard-schema";
import { TimestampOrString } from "../grape-schema";

export const mustLabResultsActionSchema = Joi.object<MustLabResultsAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  subjectMust: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": "Please select a must",
      "string.empty": "Please select a must",
    }),
  executionDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      }),
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),
  responsible: teamMemberSchema,
  temperature: Joi.number()
    .min(-20)
    .max(100)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the temperature",
      "number.empty": "Please enter a valid number for the temperature",
      "number.base": "Please enter a valid number for the temperature",
      "number.min": "Please enter a valid number for the temperature",
      "number.max": "Temperature cannot exceed 100.",
    }),
  alcohol: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the alcohol",
      "number.empty": "Please enter a valid number for the alcohol",
      "number.base": "Please enter a valid number for the alcohol",
      "number.min": "Please enter a valid number for the alcohol",
      "number.max": "Alcohol cannot exceed 100.",
    }),
  sugar: Joi.number().min(0).max(10_000).precision(2).required().messages({
    "any.required": "Please enter a valid number for the sugar",
    "number.empty": "Please enter a valid number for the sugar",
    "number.base": "Please enter a valid number for the sugar",
    "number.min": "Please enter a valid number for the sugar",
    "number.max": "Sugar cannot exceed 10 000.",
  }),
  acidity: Joi.number()
    .min(0)
    .max(10_000)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the acidity",
      "number.empty": "Please enter a valid number for the acidity",
      "number.base": "Please enter a valid number for the acidity",
      "number.min": "Please enter a valid number for the acidity",
      "number.max": "Acidity cannot exceed 10 000.",
    }),
  pH: Joi.number().min(0).max(14).precision(2).optional().allow("").messages({
    "any.required": "Please enter a valid number for the pH",
    "number.empty": "Please enter a valid number for the pH",
    "number.base": "Please enter a valid number for the pH",
    "number.min": "Please enter a valid number for the pH",
    "number.max": "pH cannot exceed 14.",
  }),
  density: Joi.number()
    .min(0)
    .max(10_000)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the density",
      "number.empty": "Please enter a valid number for the density",
      "number.base": "Please enter a valid number for the density",
      "number.min": "Please enter a valid number for the density",
      "number.max": "Density cannot exceed 10 000.",
    }),
  volatileAcidity: Joi.number()
    .min(0)
    .max(10_000)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the volatile acidity",
      "number.empty": "Please enter a valid number for the volatile acidity",
      "number.base": "Please enter a valid number for the volatile acidity",
      "number.min": "Please enter a valid number for the volatile acidity",
      "number.max": "Volatile acidity cannot exceed 10 000.",
    }),
  malicAcid: Joi.number()
    .min(0)
    .max(10_000)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the malic acid",
      "number.empty": "Please enter a valid number for the malic acid",
      "number.base": "Please enter a valid number for the malic acid",
      "number.min": "Please enter a valid number for the malic acid",
      "number.max": "Malic acid cannot exceed 10 000.",
    }),
  lacticAcid: Joi.number()
    .min(0)
    .max(10_000)
    .precision(2)
    .optional()
    .allow("")
    .messages({
      "any.required": "Please enter a valid number for the lactic acid",
      "number.empty": "Please enter a valid number for the lactic acid",
      "number.base": "Please enter a valid number for the lactic acid",
      "number.min": "Please enter a valid number for the lactic acid",
      "number.max": "Lactic acid cannot exceed 10 000.",
    }),
  labCertificateId: Joi.string().optional().allow(""),
  supportingDocuments: Joi.array()
    .items({
      name: Joi.string().optional().allow(""),
      url: Joi.string().optional().allow(""),
    })
    .optional(),
  additionalInformation: Joi.string().optional().allow(""),
  createdAt: TimestampOrString.empty("").optional(),
  createdBy: Joi.string().optional().allow(""),
});
